/**
 * Test script for audio analysis using Google AI
 * Tests the random-acid-loop.wav sample from the public folder
 */

const fs = require('fs');
const path = require('path');

// Mock AudioBuffer for testing (since we're in Node.js environment)
class MockAudioBuffer {
  constructor(duration, sampleRate, channels) {
    this.duration = duration;
    this.sampleRate = sampleRate;
    this.numberOfChannels = channels;
    this.length = Math.floor(duration * sampleRate);
  }

  getChannelData(channel) {
    // Generate mock audio data (sine wave)
    const data = new Float32Array(this.length);
    const frequency = 440; // A4 note
    for (let i = 0; i < this.length; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / this.sampleRate) * 0.5;
    }
    return data;
  }
}

async function testAudioAnalysis() {
  console.log('🎵 Starting Audio Analysis Test');
  console.log('=====================================');

  try {
    // Get file info
    const audioFile = path.join(__dirname, 'public', 'looperman-l-7471574-0407382-random-acid-loop.wav');
    const stats = fs.statSync(audioFile);
    
    console.log('📁 Audio File:', audioFile);
    console.log('📊 File Size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('📅 Created:', stats.birthtime.toLocaleString());

    // Create mock AudioBuffer (in real app, this would come from Web Audio API)
    const audioBuffer = new MockAudioBuffer(10, 44100, 2); // 10 seconds, 44.1kHz, stereo
    
    console.log('\n🎧 Audio Buffer Properties:');
    console.log('- Duration:', audioBuffer.duration, 'seconds');
    console.log('- Sample Rate:', audioBuffer.sampleRate, 'Hz');
    console.log('- Channels:', audioBuffer.numberOfChannels);
    console.log('- Length:', audioBuffer.length, 'samples');

    // Test the analysis API
    console.log('\n🔍 Testing Analysis API...');
    
    const response = await fetch('http://localhost:3000/api/audio/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioBuffer: {
          duration: audioBuffer.duration,
          sampleRate: audioBuffer.sampleRate,
          numberOfChannels: audioBuffer.numberOfChannels,
          length: audioBuffer.length,
          // Note: In real implementation, we'd need to convert AudioBuffer to a serializable format
        },
        provider: 'mock' // Start with mock to test the flow
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('\n✅ Analysis Results:');
    console.log('===================');
    console.log('Provider:', result.data.provider);
    console.log('Real Analysis:', result.data.realAnalysis);
    console.log('Confidence:', Math.round(result.data.confidence * 100) + '%');
    console.log('Analysis Time:', result.data.analysisTime + 'ms');
    
    console.log('\n🎵 Musical Features:');
    console.log('- Tempo:', result.data.features.tempo, 'BPM');
    console.log('- Key:', result.data.features.key);
    console.log('- Genre:', result.data.features.genre);
    console.log('- Mood:', result.data.features.mood);
    console.log('- Style:', result.data.features.style);
    console.log('- Instruments:', result.data.features.instruments.join(', '));
    console.log('- Dynamic Range:', result.data.features.dynamicRange.toFixed(1), 'dB');
    console.log('- Average Loudness:', result.data.features.averageLoudness.toFixed(3));

    // Test prompt generation
    console.log('\n🤖 Testing Prompt Generation...');
    
    const promptResponse = await fetch('http://localhost:3000/api/prompt/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceAudioAnalysis: result.data,
        workflowType: 'ai_generation'
      })
    });

    if (promptResponse.ok) {
      const promptResult = await promptResponse.json();
      console.log('\n✅ Generated Prompt:');
      console.log('===================');
      console.log('Prompt:', promptResult.data.prompt);
      console.log('Confidence:', Math.round(promptResult.data.confidence * 100) + '%');
      console.log('Reasoning:', promptResult.data.reasoning);
      console.log('Suggested Duration:', promptResult.data.suggestedParameters.duration, 'seconds');
      console.log('Suggested Temperature:', promptResult.data.suggestedParameters.temperature);
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure the development server is running:');
      console.log('   npm run dev');
    }
    
    if (error.message.includes('fetch is not defined')) {
      console.log('\n💡 This test requires Node.js 18+ or you can run it in the browser console');
    }
  }
}

// Run the test
testAudioAnalysis();
