'use client'

import { useState } from 'react'
import { Download, Play, Settings, FileJson, MessageSquare, Image as ImageIcon, Workflow } from 'lucide-react'

interface WorkflowNode {
  id: string
  type: string
  label: string
  config: any
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'template' | 'execute' | 'results'>('template')
  const [isRunning, setIsRunning] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [workflowConfig, setWorkflowConfig] = useState({
    imageModel: 'pollinations',
    conversationTopic: 'technology trends',
    messageCount: 5,
    temperature: 0.7,
  })

  const workflowNodes: WorkflowNode[] = [
    {
      id: '1',
      type: 'trigger',
      label: 'Manual Trigger',
      config: { triggerType: 'manual' }
    },
    {
      id: '2',
      type: 'function',
      label: 'Generate Image Prompt',
      config: {
        operation: 'Create prompt for visual representation',
        model: workflowConfig.imageModel
      }
    },
    {
      id: '3',
      type: 'http',
      label: 'Call Free Image API',
      config: {
        method: 'GET',
        url: 'https://image.pollinations.ai/prompt/',
        params: { width: 512, height: 512 }
      }
    },
    {
      id: '4',
      type: 'function',
      label: 'Analyze Image Context',
      config: { operation: 'Extract themes and objects from generated image' }
    },
    {
      id: '5',
      type: 'ai',
      label: 'Generate Chat Messages',
      config: {
        operation: 'Create conversation based on image analysis',
        messageCount: workflowConfig.messageCount,
        temperature: workflowConfig.temperature
      }
    },
    {
      id: '6',
      type: 'output',
      label: 'Format & Store Results',
      config: { format: 'json', includeTimestamps: true }
    }
  ]

  const generateImageUrl = (prompt: string) => {
    const encodedPrompt = encodeURIComponent(prompt)
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`
  }

  const simulateConversation = async () => {
    const topics = [
      'artificial intelligence and machine learning',
      'space exploration and astronomy',
      'sustainable energy solutions',
      'future of transportation',
      'digital art and creativity'
    ]

    const topic = workflowConfig.conversationTopic || topics[Math.floor(Math.random() * topics.length)]
    const imagePrompt = `${topic} futuristic concept art`

    const messages: ChatMessage[] = []

    // Simulate conversation generation
    for (let i = 0; i < workflowConfig.messageCount; i++) {
      if (i % 2 === 0) {
        messages.push({
          role: 'user',
          content: `Tell me about ${topic} from perspective ${i + 1}. What are the most interesting developments?`,
          timestamp: new Date(Date.now() + i * 2000).toISOString()
        })
      } else {
        messages.push({
          role: 'assistant',
          content: `Based on the visual representation, ${topic} shows fascinating potential. The image depicts key elements that highlight innovation in this field. Current trends suggest significant advancement in areas like automation, efficiency, and accessibility. This represents a paradigm shift in how we approach these challenges.`,
          timestamp: new Date(Date.now() + i * 2000).toISOString()
        })
      }
    }

    return { messages, imagePrompt }
  }

  const executeWorkflow = async () => {
    setIsRunning(true)
    setChatMessages([])
    setActiveTab('results')

    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 1500))
      const { messages, imagePrompt } = await simulateConversation()

      // Add messages one by one with delay
      for (let i = 0; i < messages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setChatMessages(prev => [...prev, messages[i]])
      }
    } catch (error) {
      console.error('Workflow execution failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const downloadWorkflow = () => {
    const workflowTemplate = {
      name: 'AI Chat Generator with Image Models',
      description: 'Generates AI chat conversations based on free image model outputs',
      nodes: workflowNodes,
      connections: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
        { source: '4', target: '5' },
        { source: '5', target: '6' }
      ],
      config: workflowConfig,
      version: '1.0.0',
      compatible: ['n8n', 'make', 'zapier']
    }

    const blob = new Blob([JSON.stringify(workflowTemplate, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-chat-automation-template.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Workflow className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">AI Chat Automation Template</h1>
                <p className="text-gray-600">n8n-style workflow for generating conversations with free image models</p>
              </div>
            </div>
            <button
              onClick={downloadWorkflow}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('template')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'template'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <FileJson className="w-5 h-5" />
              Workflow Template
            </button>
            <button
              onClick={() => setActiveTab('execute')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'execute'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Settings className="w-5 h-5" />
              Configure & Execute
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'results'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Results
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'template' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Workflow Architecture</h2>
              <div className="space-y-4">
                {workflowNodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    <div className="flex items-start gap-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {node.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                            {node.type.toUpperCase()}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800">{node.label}</h3>
                        </div>
                        <div className="bg-white p-3 rounded border border-purple-100">
                          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(node.config, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                    {index < workflowNodes.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="w-0.5 h-6 bg-purple-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                  Free Image APIs Used
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <div>
                      <strong>Pollinations.ai:</strong> Free unlimited image generation
                      <code className="block mt-1 text-xs bg-white p-2 rounded">
                        https://image.pollinations.ai/prompt/[YOUR_PROMPT]
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <div>
                      <strong>Alternative:</strong> Hugging Face Inference API (free tier available)
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'execute' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Configure Workflow</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Model Provider
                  </label>
                  <select
                    value={workflowConfig.imageModel}
                    onChange={(e) => setWorkflowConfig({ ...workflowConfig, imageModel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="pollinations">Pollinations.ai (Free, No Limits)</option>
                    <option value="huggingface">Hugging Face (Free Tier)</option>
                    <option value="replicate">Replicate (Free Credits)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversation Topic
                  </label>
                  <input
                    type="text"
                    value={workflowConfig.conversationTopic}
                    onChange={(e) => setWorkflowConfig({ ...workflowConfig, conversationTopic: e.target.value })}
                    placeholder="e.g., technology trends, space exploration, digital art"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Messages: {workflowConfig.messageCount}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={workflowConfig.messageCount}
                    onChange={(e) => setWorkflowConfig({ ...workflowConfig, messageCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: {workflowConfig.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={workflowConfig.temperature}
                    onChange={(e) => setWorkflowConfig({ ...workflowConfig, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">Lower = more focused, Higher = more creative</p>
                </div>

                <button
                  onClick={executeWorkflow}
                  disabled={isRunning}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                    isRunning
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  <Play className="w-5 h-5" />
                  {isRunning ? 'Running Workflow...' : 'Execute Workflow'}
                </button>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">How it works:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Generate an image based on your topic using free APIs</li>
                    <li>Analyze the generated image for visual elements and themes</li>
                    <li>Use image context to create relevant chat messages</li>
                    <li>Generate a natural conversation flow between user and AI</li>
                    <li>Export results in structured format</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated Conversation</h2>

              {isRunning && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating conversation...</p>
                  </div>
                </div>
              )}

              {!isRunning && chatMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversation generated yet. Go to Configure & Execute to run the workflow.</p>
                </div>
              )}

              {chatMessages.length > 0 && (
                <div className="space-y-4">
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Topic:</strong> {workflowConfig.conversationTopic}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Model:</strong> {workflowConfig.imageModel}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Generated:</strong> {new Date().toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold opacity-75">
                              {message.role === 'user' ? 'USER' : 'ASSISTANT'}
                            </span>
                            <span className="text-xs opacity-60">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify({ conversation: chatMessages, config: workflowConfig }, null, 2)], {
                          type: 'application/json'
                        })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'ai-conversation-results.json'
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Export Results
                    </button>
                    <button
                      onClick={executeWorkflow}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Generate New
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
