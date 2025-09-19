#!/usr/bin/env node

/**
 * Simple API Endpoints Test Script
 * Tests all the API endpoints without complex audio data
 */

import { fileURLToPath } from 'url';
import path from 'path';

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

async function testAPIEndpoints() {
  logStep(2, 'Testing API endpoints availability...');
  
  const endpoints = [
    { 
      url: '/api/audio/analyze', 
      method: 'GET', 
      name: 'Audio Analysis Info',
      description: 'Get available audio analysis providers and configuration'
    },
    { 
      url: '/api/log', 
      method: 'GET', 
      name: 'Logging Info',
      description: 'Get logging API information'
    }
  ];

  let passed = 0;
  const results = {};

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint.url}`, {
        method: endpoint.method
      });
      
      if (response.ok) {
        const data = await response.json();
        logSuccess(`${endpoint.name}: Available`);
        logInfo(`  ${endpoint.description}`);
        if (data.providers) {
          logInfo(`  Available providers: ${data.providers.join(', ')}`);
        }
        if (data.bestProvider) {
          logInfo(`  Best provider: ${data.bestProvider}`);
        }
        results[endpoint.name] = { status: 'success', data };
        passed++;
      } else {
        logWarning(`${endpoint.name}: ${response.status} ${response.statusText}`);
        results[endpoint.name] = { status: 'error', status: response.status };
      }
    } catch (error) {
      logError(`${endpoint.name}: ${error.message}`);
      results[endpoint.name] = { status: 'error', error: error.message };
    }
  }

  logInfo(`API endpoints: ${passed}/${endpoints.length} available`);
  return { passed, total: endpoints.length, results };
}

async function testLoggingAPI() {
  logStep(3, 'Testing workflow logging API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        component: 'TestScript',
        message: 'API endpoints test completed successfully',
        data: {
          timestamp: new Date().toISOString(),
          testType: 'API Endpoints Test',
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

async function testWorkflowLogic() {
  logStep(4, 'Testing workflow logic (without audio processing)...');
  
  try {
    // Test prompt generation with mock data
    const response = await fetch(`${BASE_URL}/api/prompt/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceAudioAnalysis: {
          features: {
            duration: 10,
            sampleRate: 44100,
            channels: 2,
            tempo: 120,
            key: 'C major',
            timeSignature: [4, 4],
            spectralCentroid: 1000,
            zeroCrossingRate: 0.1,
            instruments: ['piano', 'guitar'],
            genre: 'electronic',
            mood: 'upbeat',
            style: 'modern',
            dynamicRange: 20,
            averageLoudness: -12,
            harmonicRatio: 0.8
          },
          confidence: 0.9,
          analysisTime: 1.5,
          timestamp: new Date()
        },
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

async function testLyriaAPI() {
  logStep(5, 'Testing Lyria API endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/lyria/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Generate an upbeat electronic dance track with heavy basslines and synthesizer melodies',
        duration: 10,
        temperature: 0.8
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess('Lyria API is working');
      logInfo(`Status: ${result.status || 'N/A'}`);
      logInfo(`Prediction ID: ${result.predictionId || 'N/A'}`);
      logInfo(`Audio URL: ${result.audioUrl || 'N/A'}`);
      return result;
    } else {
      const errorText = await response.text();
      logError(`Lyria API failed: ${response.status} ${response.statusText}`);
      logError(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    logError(`Lyria API error: ${error.message}`);
    return null;
  }
}

async function runCompleteTest() {
  log('🚀 Starting Waveridai API Endpoints Test', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const results = {
    serverConnection: false,
    apiEndpoints: null,
    logging: false,
    promptGeneration: null,
    lyriaGeneration: null
  };

  // Test 1: Server Connection
  results.serverConnection = await testServerConnection();
  if (!results.serverConnection) {
    logError('Cannot proceed without server connection');
    return results;
  }

  // Test 2: API Endpoints
  results.apiEndpoints = await testAPIEndpoints();
  
  // Test 3: Logging
  results.logging = await testLoggingAPI();

  // Test 4: Prompt Generation
  results.promptGeneration = await testWorkflowLogic();

  // Test 5: Lyria API
  results.lyriaGeneration = await testLyriaAPI();

  // Summary
  log('\n📊 Test Results Summary', 'bright');
  log('=' .repeat(60), 'cyan');
  
  logSuccess(`Server Connection: ${results.serverConnection ? 'PASS' : 'FAIL'}`);
  logSuccess(`API Endpoints: ${results.apiEndpoints?.passed || 0}/${results.apiEndpoints?.total || 0} available`);
  logSuccess(`Logging: ${results.logging ? 'PASS' : 'FAIL'}`);
  logSuccess(`Prompt Generation: ${results.promptGeneration ? 'PASS' : 'FAIL'}`);
  logSuccess(`Lyria Generation: ${results.lyriaGeneration ? 'PASS' : 'FAIL'}`);

  const totalTests = 5;
  const passedTests = [
    results.serverConnection,
    results.apiEndpoints?.passed === results.apiEndpoints?.total,
    results.logging,
    !!results.promptGeneration,
    !!results.lyriaGeneration
  ].filter(Boolean).length;

  log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! API endpoints are working correctly.', 'green');
  } else {
    log('⚠️  Some tests failed. Check the logs above for details.', 'yellow');
  }

  // Additional info
  log('\n📋 Additional Information:', 'bright');
  logInfo('Frontend URL: http://localhost:3001/studio');
  logInfo('API Base URL: http://localhost:3001/api');
  logInfo('Available audio samples in /public folder:');
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const publicDir = path.join(path.dirname(__filename), 'public');
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir).filter(file => file.endsWith('.wav'));
      files.forEach(file => {
        logInfo(`  - ${file}`);
      });
    }
  } catch (error) {
    logWarning('Could not list audio samples');
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
