import { supabase } from '../../../lib/supabaseClient';

/**
 * @typedef {Object} ProcessSkill
 * @property {string} value - ID de la habilidad
 * @property {string} label - Nombre de la habilidad
 * @property {number} [level] - Nivel de la habilidad
 */

/**
 * @typedef {Object} ProcessUpdateData
 * @property {string} name - Nombre del proceso
 * @property {string} position - Posición
 * @property {string} area - Área
 * @property {string} modality - Modalidad
 * @property {string} requested_by - Solicitado por
 * @property {string} start_date - Fecha de inicio
 * @property {string} end_date - Fecha de fin
 * @property {string} status - Estado
 * @property {string} jobFunctions - Funciones del cargo
 * @property {string} jobRequirements - Requerimientos del cargo
 * @property {Array<ProcessSkill>} requiredSkills - Habilidades requeridas
 * @property {Array<ProcessSkill>} optionalSkills - Habilidades opcionales
 */

/**
 * Actualiza las habilidades de un proceso
 * @private
 * @async
 * @param {string} processId - ID del proceso
 * @param {Array<ProcessSkill>} requiredSkills - Habilidades requeridas
 * @param {Array<ProcessSkill>} optionalSkills - Habilidades opcionales
 */
const updateProcessSkills = async (processId, requiredSkills, optionalSkills) => {
  try {
    console.log('Iniciando updateProcessSkills con:', {
      processId,
      requiredSkills,
      optionalSkills
    });

    const { data: existingSkills, error: fetchError } = await supabase
      .from('process_skills')
      .select('skill_id, is_required, is_optional')
      .eq('process_id', processId);

    console.log('Skills existentes:', existingSkills);

    if (fetchError) throw fetchError;

    const processSkills = [
      ...requiredSkills.map(skill => {
        console.log('Procesando skill requerida:', skill);
        return {
          process_id: processId,
          skill_id: skill.skill_id || skill.value, // Manejar ambos formatos
          level: skill.level || 3,
          is_required: true,
          is_optional: false
        };
      }),
      ...optionalSkills.map(skill => {
        console.log('Procesando skill opcional:', skill);
        return {
          process_id: processId,
          skill_id: skill.skill_id || skill.value, // Manejar ambos formatos
          level: skill.level || 1,
          is_required: false,
          is_optional: true
        };
      })
    ].filter(skill => skill.skill_id);

    console.log('Skills procesadas para insertar:', processSkills);

    // 3. Eliminar habilidades existentes
    const { error: deleteError } = await supabase
      .from('process_skills')
      .delete()
      .eq('process_id', processId);

    if (deleteError) throw deleteError;

    // 4. Insertar nuevas habilidades
    if (processSkills.length > 0) {
      const { error: insertError } = await supabase
        .from('process_skills')
        .insert(processSkills);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error en updateProcessSkills:', error);
    throw error;
  }
};

/**
 * Actualiza un proceso existente en Supabase
 * @async
 * @function updateProcess
 * @param {string} id - ID del proceso a actualizar
 * @param {ProcessUpdateData} data - Datos actualizados del proceso
 * @returns {Promise<Object>} Proceso actualizado
 * @throws {Error} Si hay un error en la actualización
 */
export const updateProcess = async (id, data) => {
  try {
    // Validar que el proceso existe
    const { data: existingProcess, error: checkError } = await supabase
      .from('processes')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingProcess) {
      throw new Error('Proceso no encontrado');
    }

    // 1. Actualizar datos básicos del proceso
    const { data: updatedProcess, error } = await supabase
      .from('processes')
      .update({
        name: data.name,
        position: data.position,
        area: data.area,
        modality: data.modality,
        requested_by: data.requested_by,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        job_functions: data.jobFunctions,
        job_requirements: data.jobRequirements,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .single();

    if (error) throw error;

    // 2. Actualizar habilidades con el formato correcto
    await updateProcessSkills(
      id,
      data.requiredSkills,
      data.optionalSkills
    );

    return updatedProcess;
  } catch (error) {
    console.error('Error en updateProcess:', error);
    throw new Error(`Error al actualizar el proceso: ${error.message}`);
  }
};
