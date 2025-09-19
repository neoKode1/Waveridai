# Waveridai Setup Instructions

## 🚀 Quick Start

1. **Copy environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔑 API Configuration

### Replicate API (Required for Lyria)
1. Sign up at [replicate.com](https://replicate.com/account/api-tokens)
2. Get your API token
3. Add to `.env.local`:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```

### Google Cloud API (Recommended for Audio Analysis)
1. Create a [Google Cloud Project](https://console.cloud.google.com/)
2. Enable the Speech-to-Text API
3. Create a service account key (JSON file)
4. Download the key file to your project
5. Add to `.env.local`:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_CLOUD_CREDENTIALS_PATH=path/to/service-account-key.json
   ENABLE_REAL_AUDIO_ANALYSIS=true
   DEFAULT_ANALYSIS_PROVIDER=google
   ```

### Claude API (Alternative for Audio Analysis)
1. Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. Generate an API key
3. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ENABLE_REAL_AUDIO_ANALYSIS=true
   DEFAULT_ANALYSIS_PROVIDER=claude
   ```

### OpenAI API (Alternative for Audio Analysis)
1. Sign up at [platform.openai.com](https://platform.openai.com/api-keys)
2. Generate an API key
3. Add to `.env.local`:
   ```
   OPENAI_API_KEY=your_key_here
   ENABLE_REAL_AUDIO_ANALYSIS=true
   DEFAULT_ANALYSIS_PROVIDER=openai
   ```

## 🎵 Workflows

### AI Generation (Recommended)
- Uses Google Lyria 2 via Replicate
- Generates music from text descriptions
- Works with or without audio analysis

### Precise Synthesis
- Extracts MIDI from audio
- Trains custom models
- Requires Python ML pipeline (optional)

## 🔧 Current Status

- ✅ **Replicate Integration** - Ready for Lyria
- ✅ **Google Cloud Setup** - Ready for real audio analysis
- ✅ **Mock Analysis** - Always available as fallback
- ⏳ **Claude Integration** - Structure ready, needs implementation
- ⏳ **OpenAI Integration** - Structure ready, needs implementation

## 📊 API Status

Check the API Status panel in the app to see:
- Which providers are enabled
- Current best provider
- Setup instructions for missing APIs

## 🚨 Troubleshooting

### Google Cloud Issues
- Ensure Speech-to-Text API is enabled
- Check service account permissions
- Verify JSON key file path

### Replicate Issues
- Verify API token is correct
- Check account credits
- Ensure model access permissions

### Environment Issues
- Restart dev server after changing `.env.local`
- Check file permissions
- Verify no trailing spaces in values
