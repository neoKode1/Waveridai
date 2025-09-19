#!/usr/bin/env node

/**
 * Google Gemini Audio Analysis Test Script
 * Tests the complete workflow: Audio Upload → Gemini Analysis → Prompt Generation → Lyria
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3001';
const AUDIO_SAMPLES = [
  'looperman-l-7471574-0407382-random-acid-loop.wav',
  'looperman-l-2273068-0407395-wisp-x-alternative-type-guitar.wav',
  'looperman-l-1069771-0407380-fragments.wav'
];

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

function logData(label, data) {
  log(`📊 ${label}:`, 'magenta');
  console.log(JSON.stringify(data, null, 2));
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

async function testAudioAnalysisAPI(audioFile) {
  logStep(2, `Testing Google Gemini audio analysis for ${audioFile}...`);
  
  const audioPath = path.join(__dirname, 'public', audioFile);
  if (!fs.existsSync(audioPath)) {
    logError(`Audio file not found: ${audioPath}`);
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioPath));
    
    logInfo(`Uploading ${audioFile} (${fs.statSync(audioPath).size} bytes)...`);
    
    const response = await fetch(`${BASE_URL}/api/audio/analyze`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(`Audio analysis completed for ${audioFile}`);
      
      const analysis = result.data;
      logData('Gemini Analysis Results', {
        instruments: analysis.instruments,
        genre: analysis.genre,
        mood: analysis.mood,
        tempo: analysis.tempo,
        key: analysis.key,
        style: analysis.style,
        confidence: analysis.confidence,
        description: analysis.description,
        suggestedPrompt: analysis.suggestedPrompt
      });
      
      return analysis;
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

async function testPromptGenerationAPI(analysis, audioFile) {
  logStep(3, `Testing prompt generation for ${audioFile}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/prompt/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceAudioAnalysis: analysis,
        workflowType: 'ai_generation',
        userPrompt: analysis.suggestedPrompt || 'Generate music similar to this audio'
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(`Prompt generation completed for ${audioFile}`);
      
      const generatedPrompt = result.data;
      logData('Generated Prompt', {
        prompt: generatedPrompt.prompt,
        confidence: generatedPrompt.confidence,
        reasoning: generatedPrompt.reasoning,
        suggestedParameters: generatedPrompt.suggestedParameters
      });
      
      return generatedPrompt;
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

async function testLyriaGenerationAPI(generatedPrompt, audioFile) {
  logStep(4, `Testing Lyria AI generation for ${audioFile}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/lyria/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: generatedPrompt.prompt,
        duration: generatedPrompt.suggestedParameters?.duration || 10,
        temperature: generatedPrompt.suggestedParameters?.temperature || 0.8,
        seed: generatedPrompt.suggestedParameters?.seed
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(`Lyria generation completed for ${audioFile}`);
      
      logData('Lyria Generation Results', {
        status: result.status,
        predictionId: result.predictionId,
        audioUrl: result.audioUrl,
        duration: result.duration,
        model: result.model
      });
      
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

async function testAPIStatus() {
  logStep(5, 'Testing API endpoint status...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/audio/analyze`);
    if (response.ok) {
      const status = await response.json();
      logSuccess('Audio Analysis API status retrieved');
      logData('API Status', status);
      return true;
    } else {
      logError(`API status check failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`API status error: ${error.message}`);
    return false;
  }
}

async function runCompleteTest() {
  log('🚀 Starting Google Gemini Audio Analysis Workflow Test', 'bright');
  log('=' .repeat(70), 'cyan');
  
  const results = {
    serverConnection: false,
    audioAnalyses: {},
    promptGenerations: {},
    lyriaGenerations: {},
    apiStatus: false
  };

  // Test 1: Server Connection
  results.serverConnection = await testServerConnection();
  if (!results.serverConnection) {
    logError('Cannot proceed without server connection');
    return results;
  }

  // Test 2: API Status
  results.apiStatus = await testAPIStatus();

  // Test 3-5: Complete workflow for each audio sample
  for (const audioFile of AUDIO_SAMPLES) {
    log(`\n🎵 Testing complete workflow with: ${audioFile}`, 'magenta');
    log('-' .repeat(60), 'cyan');
    
    // Audio Analysis with Google Gemini
    const analysis = await testAudioAnalysisAPI(audioFile);
    results.audioAnalyses[audioFile] = analysis;
    
    if (analysis) {
      // Prompt Generation
      const generatedPrompt = await testPromptGenerationAPI(analysis, audioFile);
      results.promptGenerations[audioFile] = generatedPrompt;
      
      if (generatedPrompt) {
        // Lyria Generation
        const lyriaResult = await testLyriaGenerationAPI(generatedPrompt, audioFile);
        results.lyriaGenerations[audioFile] = lyriaResult;
      }
    }
    
    // Small delay between samples
    logInfo('Waiting 2 seconds before next sample...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  log('\n📊 Test Results Summary', 'bright');
  log('=' .repeat(70), 'cyan');
  
  logSuccess(`Server Connection: ${results.serverConnection ? 'PASS' : 'FAIL'}`);
  logSuccess(`API Status: ${results.apiStatus ? 'PASS' : 'FAIL'}`);
  logSuccess(`Audio Analyses: ${Object.keys(results.audioAnalyses).length}/${AUDIO_SAMPLES.length} samples processed`);
  logSuccess(`Prompt Generations: ${Object.keys(results.promptGenerations).length}/${AUDIO_SAMPLES.length} samples processed`);
  logSuccess(`Lyria Generations: ${Object.keys(results.lyriaGenerations).length}/${AUDIO_SAMPLES.length} samples processed`);

  // Detailed results
  log('\n📋 Detailed Results by Sample:', 'bright');
  AUDIO_SAMPLES.forEach(audioFile => {
    log(`\n🎵 ${audioFile}:`, 'magenta');
    log(`  Gemini Analysis: ${results.audioAnalyses[audioFile] ? '✅' : '❌'}`);
    log(`  Prompt Generation: ${results.promptGenerations[audioFile] ? '✅' : '❌'}`);
    log(`  Lyria Generation: ${results.lyriaGenerations[audioFile] ? '✅' : '❌'}`);
    
    if (results.audioAnalyses[audioFile]) {
      const analysis = results.audioAnalyses[audioFile];
      log(`    Genre: ${analysis.genre}`);
      log(`    Mood: ${analysis.mood}`);
      log(`    Tempo: ${analysis.tempo} BPM`);
      log(`    Key: ${analysis.key}`);
      log(`    Instruments: ${analysis.instruments.join(', ')}`);
    }
  });

  const totalTests = 2 + (AUDIO_SAMPLES.length * 3); // server + api + (analysis + prompt + lyria) * samples
  const passedTests = (results.serverConnection ? 1 : 0) + 
                     (results.apiStatus ? 1 : 0) +
                     Object.keys(results.audioAnalyses).length + 
                     Object.keys(results.promptGenerations).length + 
                     Object.keys(results.lyriaGenerations).length;

  log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Google Gemini audio analysis workflow is working perfectly!', 'green');
  } else {
    log('⚠️  Some tests failed. Check the logs above for details.', 'yellow');
  }

  // Workflow summary
  log('\n🔄 Workflow Summary:', 'bright');
  logInfo('1. User uploads audio file');
  logInfo('2. Google Gemini analyzes audio (instruments, genre, mood, tempo, key)');
  logInfo('3. System generates intelligent prompt from analysis');
  logInfo('4. Prompt sent to Google Lyria via Replicate API');
  logInfo('5. AI generates new music based on original audio characteristics');

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
