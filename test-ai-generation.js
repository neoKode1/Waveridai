#!/usr/bin/env node

/**
 * Waveridai AI Generation Test Script
 * Tests the AI generation workflow using audio samples from the public folder
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Import fetch dynamically for ES modules compatibility
let fetch;
(async () => {
  const { default: nodeFetch } = await import('node-fetch');
  fetch = nodeFetch;
})();

// Configuration
const BASE_URL = 'http://localhost:3001';
const AUDIO_SAMPLES = [
  'looperman-l-7471574-0407382-random-acid-loop.wav',
  'looperman-l-2273068-0407395-wisp-x-alternative-type-guitar.wav',
  'looperman-l-1069771-0407380-fragments.wav'
];

// Test prompts for different samples
const TEST_PROMPTS = {
  'looperman-l-7471574-0407382-random-acid-loop.wav': 'Generate an upbeat electronic acid house track with heavy basslines, synthesizer stabs, and driving 4/4 rhythm',
  'looperman-l-2273068-0407395-wisp-x-alternative-type-guitar.wav': 'Create an alternative rock song with electric guitar riffs, powerful drums, and melodic vocals',
  'looperman-l-1069771-0407380-fragments.wav': 'Generate ambient electronic music with atmospheric pads, subtle percussion, and ethereal melodies'
};

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

async function testAudioAnalysis(audioFile) {
  logStep(2, `Testing audio analysis for ${audioFile}...`);
  
  const audioPath = path.join(__dirname, 'public', audioFile);
  if (!fs.existsSync(audioPath)) {
    logError(`Audio file not found: ${audioPath}`);
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioPath));
    
    const response = await fetch(`${BASE_URL}/api/audio/analyze`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(`Audio analysis completed for ${audioFile}`);
      logInfo(`Duration: ${result.data?.features?.duration || 'N/A'}s`);
      logInfo(`Sample Rate: ${result.data?.features?.sampleRate || 'N/A'}Hz`);
      logInfo(`Channels: ${result.data?.features?.channels || 'N/A'}`);
      logInfo(`Tempo: ${result.data?.features?.tempo || 'N/A'} BPM`);
      logInfo(`Key: ${result.data?.features?.key || 'N/A'}`);
      logInfo(`Genre: ${result.data?.features?.genre || 'N/A'}`);
      logInfo(`Mood: ${result.data?.features?.mood || 'N/A'}`);
      return result.data;
    } else {
      logError(`Audio analysis failed: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Audio analysis error: ${error.message}`);
    return null;
  }
}

async function testPromptGeneration(audioAnalysis, audioFile) {
  logStep(3, `Testing prompt generation for ${audioFile}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/prompt/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceAudioAnalysis: audioAnalysis,
        workflowType: 'ai_generation',
        userPrompt: TEST_PROMPTS[audioFile] || 'Generate music based on this audio'
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(`Prompt generation completed for ${audioFile}`);
      logInfo(`Generated Prompt: "${result.data?.prompt || 'N/A'}"`);
      logInfo(`Confidence: ${Math.round((result.data?.confidence || 0) * 100)}%`);
      logInfo(`Reasoning: ${result.data?.reasoning || 'N/A'}`);
      return result.data;
    } else {
      logError(`Prompt generation failed: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Prompt generation error: ${error.message}`);
    return null;
  }
}

async function testLyriaGeneration(generatedPrompt, audioFile) {
  logStep(4, `Testing Lyria AI generation for ${audioFile}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/lyria/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: generatedPrompt?.prompt || TEST_PROMPTS[audioFile],
        duration: generatedPrompt?.suggestedParameters?.duration || 10,
        temperature: generatedPrompt?.suggestedParameters?.temperature || 0.8,
        seed: generatedPrompt?.suggestedParameters?.seed
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(`Lyria generation completed for ${audioFile}`);
      logInfo(`Status: ${result.status || 'N/A'}`);
      logInfo(`Prediction ID: ${result.predictionId || 'N/A'}`);
      logInfo(`Audio URL: ${result.audioUrl || 'N/A'}`);
      return result;
    } else {
      logError(`Lyria generation failed: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Lyria generation error: ${error.message}`);
    return null;
  }
}

async function testWorkflowLogging() {
  logStep(5, 'Testing workflow logging...');
  
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
          samples: AUDIO_SAMPLES.length
        }
      })
    });

    if (response.ok) {
      logSuccess('Workflow logging test completed');
      return true;
    } else {
      logError(`Logging failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Logging error: ${error.message}`);
    return false;
  }
}

async function runCompleteTest() {
  log('🚀 Starting Waveridai AI Generation Workflow Test', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const results = {
    serverConnection: false,
    audioAnalyses: {},
    promptGenerations: {},
    lyriaGenerations: {},
    logging: false
  };

  // Test 1: Server Connection
  results.serverConnection = await testServerConnection();
  if (!results.serverConnection) {
    logError('Cannot proceed without server connection');
    return results;
  }

  // Test 2-4: Audio Processing for each sample
  for (const audioFile of AUDIO_SAMPLES) {
    log(`\n🎵 Testing with sample: ${audioFile}`, 'magenta');
    log('-' .repeat(50), 'cyan');
    
    // Audio Analysis
    const audioAnalysis = await testAudioAnalysis(audioFile);
    results.audioAnalyses[audioFile] = audioAnalysis;
    
    if (audioAnalysis) {
      // Prompt Generation
      const generatedPrompt = await testPromptGeneration(audioAnalysis, audioFile);
      results.promptGenerations[audioFile] = generatedPrompt;
      
      if (generatedPrompt) {
        // Lyria Generation
        const lyriaResult = await testLyriaGeneration(generatedPrompt, audioFile);
        results.lyriaGenerations[audioFile] = lyriaResult;
      }
    }
    
    // Small delay between samples
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test 5: Logging
  results.logging = await testWorkflowLogging();

  // Summary
  log('\n📊 Test Results Summary', 'bright');
  log('=' .repeat(60), 'cyan');
  
  logSuccess(`Server Connection: ${results.serverConnection ? 'PASS' : 'FAIL'}`);
  logSuccess(`Audio Analyses: ${Object.keys(results.audioAnalyses).length}/${AUDIO_SAMPLES.length} samples processed`);
  logSuccess(`Prompt Generations: ${Object.keys(results.promptGenerations).length}/${AUDIO_SAMPLES.length} samples processed`);
  logSuccess(`Lyria Generations: ${Object.keys(results.lyriaGenerations).length}/${AUDIO_SAMPLES.length} samples processed`);
  logSuccess(`Logging: ${results.logging ? 'PASS' : 'FAIL'}`);

  // Detailed results
  log('\n📋 Detailed Results:', 'bright');
  AUDIO_SAMPLES.forEach(audioFile => {
    log(`\n🎵 ${audioFile}:`, 'magenta');
    log(`  Audio Analysis: ${results.audioAnalyses[audioFile] ? '✅' : '❌'}`);
    log(`  Prompt Generation: ${results.promptGenerations[audioFile] ? '✅' : '❌'}`);
    log(`  Lyria Generation: ${results.lyriaGenerations[audioFile] ? '✅' : '❌'}`);
  });

  const totalTests = 1 + (AUDIO_SAMPLES.length * 3) + 1; // server + (audio + prompt + lyria) * samples + logging
  const passedTests = (results.serverConnection ? 1 : 0) + 
                     Object.keys(results.audioAnalyses).length + 
                     Object.keys(results.promptGenerations).length + 
                     Object.keys(results.lyriaGenerations).length + 
                     (results.logging ? 1 : 0);

  log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! AI Generation workflow is working correctly.', 'green');
  } else {
    log('⚠️  Some tests failed. Check the logs above for details.', 'yellow');
  }

  return results;
}

// Run the test
if (require.main === module) {
  runCompleteTest()
    .then(results => {
      log('\n✨ Test completed!', 'bright');
      process.exit(0);
    })
    .catch(error => {
      logError(`Test failed with error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  runCompleteTest,
  testServerConnection,
  testAudioAnalysis,
  testPromptGeneration,
  testLyriaGeneration,
  testWorkflowLogging
};
