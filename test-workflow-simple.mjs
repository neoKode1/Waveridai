#!/usr/bin/env node

/**
 * Simple Waveridai Workflow Test Script
 * Tests the AI generation workflow endpoints without file uploads
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3001';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[STEP ${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test functions
async function testServerConnection() {
  logStep(1, 'Testing server connection...');
  try {
    const response = await fetch(`${BASE_URL}/studio`);
    if (response.ok) {
      logSuccess('Server is running and accessible');
      return true;
    } else {
      logError(`Server returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to connect to server: ${error.message}`);
    return false;
  }
}

async function testAudioAnalysisAPI() {
  logStep(2, 'Testing audio analysis API endpoint...');
  
  try {
    // Create a realistic AudioBuffer with synthetic audio data
    const duration = 10; // 10 seconds
    const sampleRate = 44100;
    const numberOfChannels = 2;
    const length = sampleRate * duration;
    
    const mockAudioBuffer = {
      duration: duration,
      sampleRate: sampleRate,
      numberOfChannels: numberOfChannels,
      length: length,
      getChannelData: function(channel) {
        const data = new Float32Array(this.length);
        // Generate a simple sine wave with some harmonics for more realistic audio
        for (let i = 0; i < this.length; i++) {
          const t = i / this.sampleRate;
          // Create a musical chord (C major: C, E, G)
          const freq1 = 261.63; // C4
          const freq2 = 329.63; // E4
          const freq3 = 392.00; // G4
          
          const wave1 = Math.sin(2 * Math.PI * freq1 * t) * 0.3;
          const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.2;
          const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.2;
          
          // Add some envelope and slight noise
          const envelope = Math.exp(-t * 0.1); // Decay envelope
          const noise = (Math.random() - 0.5) * 0.05;
          
          data[i] = (wave1 + wave2 + wave3) * envelope + noise;
        }
        return data;
      },
      copyFromChannel: function(destination, channelNumber, startInChannel = 0) {
        const source = this.getChannelData(channelNumber);
        destination.set(source.subarray(startInChannel, startInChannel + destination.length));
      },
      copyToChannel: function(source, channelNumber, startInChannel = 0) {
        const destination = this.getChannelData(channelNumber);
        destination.set(source, startInChannel);
      }
    };

    const response = await fetch(`${BASE_URL}/api/audio/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audioBuffer: mockAudioBuffer,
        provider: 'mock' // Use mock provider for testing
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess('Audio analysis API is working');
      logInfo(`Provider: ${result.data?.provider || 'N/A'}`);
      logInfo(`Real Analysis: ${result.data?.realAnalysis || 'N/A'}`);
      logInfo(`Tempo: ${result.data?.features?.tempo || 'N/A'} BPM`);
      logInfo(`Key: ${result.data?.features?.key || 'N/A'}`);
      logInfo(`Genre: ${result.data?.features?.genre || 'N/A'}`);
      logInfo(`Confidence: ${Math.round((result.data?.confidence || 0) * 100)}%`);
      return result.data;
    } else {
      const errorText = await response.text();
      logError(`Audio analysis failed: ${response.status} ${response.statusText}`);
      logError(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    logError(`Audio analysis error: ${error.message}`);
    return null;
  }
}

async function testPromptGenerationAPI(mockAudioAnalysis) {
  logStep(3, 'Testing prompt generation API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/prompt/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceAudioAnalysis: mockAudioAnalysis,
        workflowType: 'ai_generation',
        userPrompt: 'Generate an upbeat electronic dance track with heavy basslines and synthesizer melodies'
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess('Prompt generation API is working');
      logInfo(`Generated Prompt: "${result.data?.prompt || 'N/A'}"`);
      logInfo(`Confidence: ${Math.round((result.data?.confidence || 0) * 100)}%`);
      logInfo(`Reasoning: ${result.data?.reasoning || 'N/A'}`);
      return result.data;
    } else {
      const errorText = await response.text();
      logError(`Prompt generation failed: ${response.status} ${response.statusText}`);
      logError(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    logError(`Prompt generation error: ${error.message}`);
    return null;
  }
}

async function testLyriaGenerationAPI(generatedPrompt) {
  logStep(4, 'Testing Lyria AI generation API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/lyria/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: generatedPrompt?.prompt || 'Generate an upbeat electronic dance track with heavy basslines and synthesizer melodies',
        duration: generatedPrompt?.suggestedParameters?.duration || 10,
        temperature: generatedPrompt?.suggestedParameters?.temperature || 0.8,
        seed: generatedPrompt?.suggestedParameters?.seed
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess('Lyria generation API is working');
      logInfo(`Status: ${result.status || 'N/A'}`);
      logInfo(`Prediction ID: ${result.predictionId || 'N/A'}`);
      logInfo(`Audio URL: ${result.audioUrl || 'N/A'}`);
      return result;
    } else {
      const errorText = await response.text();
      logError(`Lyria generation failed: ${response.status} ${response.statusText}`);
      logError(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    logError(`Lyria generation error: ${error.message}`);
    return null;
  }
}

async function testLoggingAPI() {
  logStep(5, 'Testing workflow logging API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        component: 'TestScript',
        message: 'Workflow test completed successfully',
        data: {
          timestamp: new Date().toISOString(),
          testType: 'AI Generation Workflow',
          version: '1.0.0'
        }
      })
    });

    if (response.ok) {
      logSuccess('Logging API is working');
      return true;
    } else {
      const errorText = await response.text();
      logError(`Logging failed: ${response.status} ${response.statusText}`);
      logError(`Error details: ${errorText}`);
      return false;
    }
  } catch (error) {
    logError(`Logging error: ${error.message}`);
    return false;
  }
}

async function testAPIEndpoints() {
  logStep(6, 'Testing API endpoint availability...');
  
  const endpoints = [
    { url: '/api/audio/analyze', method: 'GET', name: 'Audio Analysis Info' },
    { url: '/api/prompt/generate', method: 'GET', name: 'Prompt Generation Info' },
    { url: '/api/lyria/generate', method: 'GET', name: 'Lyria Generation Info' },
    { url: '/api/log', method: 'GET', name: 'Logging Info' }
  ];

  let passed = 0;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint.url}`, {
        method: endpoint.method
      });
      
      if (response.ok) {
        logSuccess(`${endpoint.name}: Available`);
        passed++;
      } else {
        logWarning(`${endpoint.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      logError(`${endpoint.name}: ${error.message}`);
    }
  }

  logInfo(`API endpoints: ${passed}/${endpoints.length} available`);
  return passed === endpoints.length;
}

async function runCompleteTest() {
  log('🚀 Starting Waveridai Workflow API Test', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const results = {
    serverConnection: false,
    audioAnalysis: null,
    promptGeneration: null,
    lyriaGeneration: null,
    logging: false,
    apiEndpoints: false
  };

  // Test 1: Server Connection
  results.serverConnection = await testServerConnection();
  if (!results.serverConnection) {
    logError('Cannot proceed without server connection');
    return results;
  }

  // Test 2: Audio Analysis
  results.audioAnalysis = await testAudioAnalysisAPI();
  
  // Test 3: Prompt Generation
  if (results.audioAnalysis) {
    results.promptGeneration = await testPromptGenerationAPI(results.audioAnalysis);
  }
  
  // Test 4: Lyria Generation
  if (results.promptGeneration) {
    results.lyriaGeneration = await testLyriaGenerationAPI(results.promptGeneration);
  }

  // Test 5: Logging
  results.logging = await testLoggingAPI();

  // Test 6: API Endpoints
  results.apiEndpoints = await testAPIEndpoints();

  // Summary
  log('\n📊 Test Results Summary', 'bright');
  log('=' .repeat(60), 'cyan');
  
  logSuccess(`Server Connection: ${results.serverConnection ? 'PASS' : 'FAIL'}`);
  logSuccess(`Audio Analysis: ${results.audioAnalysis ? 'PASS' : 'FAIL'}`);
  logSuccess(`Prompt Generation: ${results.promptGeneration ? 'PASS' : 'FAIL'}`);
  logSuccess(`Lyria Generation: ${results.lyriaGeneration ? 'PASS' : 'FAIL'}`);
  logSuccess(`Logging: ${results.logging ? 'PASS' : 'FAIL'}`);
  logSuccess(`API Endpoints: ${results.apiEndpoints ? 'PASS' : 'FAIL'}`);

  const totalTests = 6;
  const passedTests = [
    results.serverConnection,
    results.audioAnalysis,
    results.promptGeneration,
    results.lyriaGeneration,
    results.logging,
    results.apiEndpoints
  ].filter(Boolean).length;

  log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! AI Generation workflow APIs are working correctly.', 'green');
  } else {
    log('⚠️  Some tests failed. Check the logs above for details.', 'yellow');
  }

  // Additional info
  log('\n📋 Additional Information:', 'bright');
  logInfo('Frontend URL: http://localhost:3001/studio');
  logInfo('API Base URL: http://localhost:3001/api');
  logInfo('Available audio samples in /public folder:');
  
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir).filter(file => file.endsWith('.wav'));
    files.forEach(file => {
      logInfo(`  - ${file}`);
    });
  }

  return results;
}

// Run the test
runCompleteTest()
  .then(results => {
    log('\n✨ Test completed!', 'bright');
    process.exit(0);
  })
  .catch(error => {
    logError(`Test failed with error: ${error.message}`);
    process.exit(1);
  });
