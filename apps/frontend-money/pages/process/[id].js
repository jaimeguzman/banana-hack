import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import ProcessHeader from '../../components/process/ProcessHeader'
import CandidateTable from '../../components/CandidateTable'
import { ProcessProvider } from '../../context/ProcessContext'
import ProcessContent from '../../components/process/ProcessContent'

export default function Process() {
  return (
    <ProcessProvider>
      <ProcessContent />
    </ProcessProvider>
  )
}
