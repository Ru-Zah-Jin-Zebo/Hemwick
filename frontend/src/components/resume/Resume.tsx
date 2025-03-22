'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Resume() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center pb-6 border-b">
        <h1 className="text-3xl font-bold">Your Name</h1>
        <p className="text-muted-foreground">Full Stack Developer</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-sm">youremail@example.com</span>
          <span className="text-sm">(123) 456-7890</span>
          <span className="text-sm">City, Country</span>
        </div>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Experienced Full Stack Developer with a passion for building innovative 
            web applications. Proven track record of delivering high-quality solutions 
            on time and within budget. Strong problem-solving abilities and a knack for 
            learning new technologies quickly.
          </p>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Senior Developer</h3>
              <span className="text-gray-600">2021 - Present</span>
            </div>
            <h4 className="text-md italic mb-2">Amazing Tech Company</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Led development of a mission-critical application using Next.js and Node.js</li>
              <li>Implemented CI/CD pipelines reducing deployment time by 50%</li>
              <li>Mentored junior developers and conducted code reviews</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Full Stack Developer</h3>
              <span className="text-gray-600">2018 - 2021</span>
            </div>
            <h4 className="text-md italic mb-2">Great Software Inc.</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Developed and maintained multiple client websites using React and Django</li>
              <li>Optimized database queries improving application performance by 30%</li>
              <li>Collaborated with design team to implement responsive UI components</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <p>React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Backend</h3>
              <p>Node.js, Python, Django, FastAPI</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Database</h3>
              <p>PostgreSQL, MongoDB, Redis</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">DevOps</h3>
              <p>Docker, AWS, CI/CD, GitHub Actions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold">B.S. in Computer Science</h3>
            <span className="text-gray-600">2014 - 2018</span>
          </div>
          <p>University of Technology</p>
        </CardContent>
      </Card>
    </div>
  )
}