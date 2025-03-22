'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ResumeProps = {
  openChatWithQuery?: (query: string) => void
}

export default function Resume({ openChatWithQuery }: ResumeProps) {
  const handleClick = (item: string) => {
    if (openChatWithQuery) {
      openChatWithQuery(`Tell me about Jason's experience with ${item}`)
    }
  }
  
  const ClickableItem = ({ children, item }: { children: React.ReactNode, item: string }) => (
    <Badge 
      variant="outline" 
      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors m-1 py-1 px-2 text-xs font-medium"
      onClick={() => handleClick(item)}
    >
      {children}
    </Badge>
  )

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center pb-6 border-b">
        <h1 className="text-3xl font-bold">Jason Causey</h1>
        <p className="text-muted-foreground">Software Engineer III</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <span className="text-sm">830-832-7404</span>
          <a href="mailto:jcausey93@gmail.com" className="text-sm hover:underline">jcausey93@gmail.com</a>
        </div>
      </div>

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Software Engineer III: Project Sentinel</h3>
              <span className="text-muted-foreground">Dec 2024 - Present</span>
            </div>
            <h4 className="text-md italic mb-2">Aristocrat, R&D - Austin, TX</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Spearheaded the design and implementation of an <ClickableItem item="AI-driven anomaly detection">AI-driven anomaly detection</ClickableItem> service focused on identifying vulnerabilities in Electronic Gaming Machines (EGMs), reducing potential security risks by proactively flagging irregular system behaviors.</li>
              <li>Developed robust <ClickableItem item="backend services">backend services</ClickableItem> and <ClickableItem item="RESTful APIs">RESTful APIs</ClickableItem> with <ClickableItem item="Python">Python</ClickableItem>, <ClickableItem item="FastAPI">FastAPI</ClickableItem>, and <ClickableItem item="TypeScript">TypeScript</ClickableItem>, seamlessly integrating real-time anomaly alert systems with modern frontend dashboards (<ClickableItem item="React">React</ClickableItem>/<ClickableItem item="Next.js">Next.js</ClickableItem>) for continuous monitoring and rapid incident response.</li>
              <li>Built and maintained scalable <ClickableItem item="AI infrastructure">AI infrastructure</ClickableItem> on <ClickableItem item="multi-GPU clusters">multi-GPU clusters</ClickableItem> with <ClickableItem item="Docker">Docker</ClickableItem> containerization, ensuring efficient model training, low-latency inference, and enhanced system security.</li>
              <li>Collaborated closely with cybersecurity experts, product managers, and operations teams to integrate AI-powered vulnerability detection into existing EGM security protocols, streamlining response procedures and minimizing risk exposure.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Software Engineer II: AIQA</h3>
              <span className="text-muted-foreground">Dec 2022 - Dec 2024</span>
            </div>
            <h4 className="text-md italic mb-2">Aristocrat, R&D - Austin, TX</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><ClickableItem item="Machine Learning project lead">Machine Learning project lead</ClickableItem> spearheading development of in-house AI solutions using <ClickableItem item="open-source LLMs">open-source LLMs</ClickableItem>, managing a 9-person team to implement custom <ClickableItem item="fine-tuning pipelines">fine-tuning pipelines</ClickableItem> and internal model hosting infrastructure for enterprise-wide deployment.</li>
              <li>Built and maintained an enterprise <ClickableItem item="AI quality assurance system">AI quality assurance system</ClickableItem> utilizing fine-tuned open-source LLMs (<ClickableItem item="Llama">Llama</ClickableItem>, <ClickableItem item="Qwen">Qwen</ClickableItem>), implementing automated code analysis and test generation across TFS, GitHub, and SVN codebases with custom data extraction pipelines.</li>
              <li>Established foundational AI research resulting in department-wide AI standards, covering <ClickableItem item="model evaluation metrics">model evaluation metrics</ClickableItem>, <ClickableItem item="training protocols">training protocols</ClickableItem>, and <ClickableItem item="deployment best practices">deployment best practices</ClickableItem>.</li>
              <li>Pioneered advanced <ClickableItem item="RAG architecture">RAG architecture</ClickableItem> custom <ClickableItem item="Method Analysis Context graphs">Method Analysis Context graphs</ClickableItem>, and <ClickableItem item="Chroma DB">Chroma DB</ClickableItem> enabling automated test generation with deep code-base understanding and 90% context relevancy.</li>
              <li>Designed scalable AI infrastructure supporting parallel model training and inference, using <ClickableItem item="Axolotl">Axolotl</ClickableItem>, across 5 high-performance NVIDIA workstations, implementing REST APIs with FastAPI for enterprise deployment.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Software Engineer: FSM</h3>
              <span className="text-muted-foreground">Dec 2021 - Dec 2022</span>
            </div>
            <h4 className="text-md italic mb-2">Aristocrat, R&D - Austin, TX</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Developed and maintained <ClickableItem item="finite state machine tools">finite state machine tools</ClickableItem> enhancing game state visualization and analysis, automating state extraction and diagram generation.</li>
              <li>Fostered collaboration through comprehensive documentation and training initiatives, integrating AI and advanced parsing techniques.</li>
              <li>Improved tool capabilities for robust performance across diverse game development scenarios.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">M.S. in Computer Science, Focus in AI and Machine Learning</h3>
              <span className="text-muted-foreground">Jan 2025 - Current</span>
            </div>
            <p>Georgia Tech University - Atlanta, GA</p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">B.S. in Computer Science, Focus in Big Data</h3>
              <span className="text-muted-foreground">Aug 2019 - Dec 2021</span>
            </div>
            <p>University of Texas - Austin, TX</p>
            <p className="text-sm mt-1">• Rowdy Hacks SP2021 Hackers Choice Winner: <ClickableItem item="Erotech">Erotech</ClickableItem>.</p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                <ClickableItem item="Python">Python</ClickableItem>
                <ClickableItem item="TypeScript">TypeScript</ClickableItem>
                <ClickableItem item="C">C</ClickableItem>
                <ClickableItem item="C++">C++</ClickableItem>
                <ClickableItem item="C#">C#</ClickableItem>
                <ClickableItem item="Java">Java</ClickableItem>
                <ClickableItem item="CUDA">CUDA</ClickableItem>
                <ClickableItem item="JavaScript">JavaScript</ClickableItem>
                <ClickableItem item="SQL">SQL</ClickableItem>
                <ClickableItem item="Swift">Swift</ClickableItem>
                <ClickableItem item="Rust">Rust</ClickableItem>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Frameworks/Tools</h3>
              <div className="flex flex-wrap gap-2">
                <ClickableItem item="PyTorch">PyTorch</ClickableItem>
                <ClickableItem item="Django">Django</ClickableItem>
                <ClickableItem item="FastAPI">FastAPI</ClickableItem>
                <ClickableItem item="NGINX">NGINX</ClickableItem>
                <ClickableItem item="Transformers">Transformers</ClickableItem>
                <ClickableItem item="React">React</ClickableItem>
                <ClickableItem item="Next.js">Next.js</ClickableItem>
                <ClickableItem item="PyBind11">PyBind11</ClickableItem>
                <ClickableItem item="CMake">CMake</ClickableItem>
                <ClickableItem item="MQTT">MQTT</ClickableItem>
                <ClickableItem item="Apache">Apache</ClickableItem>
                <ClickableItem item="TCP">TCP</ClickableItem>
                <ClickableItem item="UDP">UDP</ClickableItem>
                <ClickableItem item="DNS">DNS</ClickableItem>
                <ClickableItem item="Postgres">Postgres</ClickableItem>
                <ClickableItem item="GCP">GCP</ClickableItem>
                <ClickableItem item="Spark">Spark</ClickableItem>
                <ClickableItem item="Hadoop">Hadoop</ClickableItem>
                <ClickableItem item="SonarCube">SonarCube</ClickableItem>
                <ClickableItem item="RabbitMQ">RabbitMQ</ClickableItem>
                <ClickableItem item="Docker">Docker</ClickableItem>
                <ClickableItem item="ChromaDB">ChromaDB</ClickableItem>
                <ClickableItem item="Pinecone">Pinecone</ClickableItem>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">AI/ML</h3>
              <div className="flex flex-wrap gap-2">
                <ClickableItem item="LLM Fine-tuning">LLM Fine-tuning (Axolotl)</ClickableItem>
                <ClickableItem item="Multi-node and Multi-GPU Distributed Training">Multi-node/Multi-GPU Training</ClickableItem>
                <ClickableItem item="Model Quantization">Model Quantization</ClickableItem>
                <ClickableItem item="QLORA">QLORA</ClickableItem>
                <ClickableItem item="Advanced RAG Systems">Advanced RAG Systems</ClickableItem>
                <ClickableItem item="Llama">Llama</ClickableItem>
                <ClickableItem item="Mistral">Mistral</ClickableItem>
                <ClickableItem item="Qwen">Qwen</ClickableItem>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Other</h3>
              <div className="flex flex-wrap gap-2">
                <ClickableItem item="Git">Git</ClickableItem>
                <ClickableItem item="Linux">Linux</ClickableItem>
                <ClickableItem item="System Architecture">System Architecture</ClickableItem>
                <ClickableItem item="Hardware Design">Hardware Design</ClickableItem>
                <ClickableItem item="Multi-GPU Orchestration">Multi-GPU Orchestration</ClickableItem>
                <ClickableItem item="Project Management">Project Management</ClickableItem>
                <ClickableItem item="Agile Development">Agile Development</ClickableItem>
                <ClickableItem item="JIRA/Confluence">JIRA/Confluence</ClickableItem>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}