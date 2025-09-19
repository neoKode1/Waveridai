# Waveridai - Polyphonic Neural Audio Synthesis

A cutting-edge polyphonic neural audio synthesis application that converts audio samples from one instrument/sound to another while maintaining musical structure. The app uses advanced AI models for polyphonic content processing, beating current monophonic limitations in the market.

## 🎵 Core Workflows

### **Precise Synthesis** (MIDI-based)
1. **Audio Input**: User uploads source audio (any instrument/sound)
2. **Multi-track MIDI Extraction**: Convert polyphonic audio to MIDI using Basic Pitch + source separation
3. **Reference Audio Training**: User uploads custom reference sound to create personalized AI instrument
4. **Polyphonic Synthesis**: Generate new audio using extracted MIDI with custom reference timbre
5. **Real-time Preview**: Instant playback and manipulation of results

### **AI Generation** (Google Lyria 2)
1. **Audio Input**: User uploads source audio for style reference (optional)
2. **Music Prompt**: User describes the desired music in natural language
3. **AI Generation**: Google Lyria 2 generates complete musical arrangements
4. **High-Quality Output**: 48kHz stereo audio with polyphonic arrangements
5. **Real-time Preview**: Instant playback and download

## 🚀 Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Components** with modern UI/UX

### Backend
- **Next.js API routes**
- **Python ML Pipeline** integration
- **Web Audio API** for real-time processing

### ML Pipeline
- **Basic Pitch** (Spotify) for MIDI extraction
- **Spleeter** for source separation
- **Custom DDSP/Diffusion models** for synthesis
- **PyTorch** for model training

## 📁 Project Structure

```
waveridai/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── api/               # API routes
│   │   │   ├── upload/        # File upload endpoints
│   │   │   ├── process/       # Audio processing
│   │   │   ├── models/        # Model training/inference
│   │   │   └── synthesis/     # Audio synthesis
│   │   ├── studio/            # Main application page
│   │   └── components/        # React components
│   ├── components/
│   │   ├── audio/            # Audio-specific components
│   │   │   ├── AudioUploader.tsx
│   │   │   ├── WaveformDisplay.tsx
│   │   │   └── AudioPlayer.tsx
│   │   ├── ui/               # Reusable UI components
│   │   └── workflow/         # Workflow-specific components
│   ├── lib/
│   │   ├── audio/            # Audio processing utilities
│   │   ├── models/           # ML model interfaces
│   │   ├── utils/            # General utilities
│   │   └── hooks/            # React hooks
│   └── python/               # Python ML processing
│       ├── basic_pitch/      # MIDI extraction
│       ├── source_sep/       # Audio source separation
│       ├── training/         # Custom model training
│       └── synthesis/        # Audio synthesis
├── public/
│   ├── models/               # Pre-trained model files
│   └── samples/              # Demo audio samples
└── docs/
    ├── API.md
    └── DEPLOYMENT.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- npm or yarn
- **Replicate API Token** (for AI Generation workflow)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd waveridai
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "REPLICATE_API_TOKEN=your_replicate_api_token_here" > .env.local
   echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
   ```
   
   Get your Replicate API token from: https://replicate.com/account/api-tokens

4. **Set up Python ML pipeline** (for Precise Synthesis workflow)
   ```bash
   cd src/python
   pip install -r requirements.txt
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the Python ML service** (for Precise Synthesis - in another terminal)
   ```bash
   cd src/python
   python main.py
   ```

The application will be available at `http://localhost:3000`

## 🎯 Key Features

### Phase 1 (MVP)
- ✅ Audio file upload and validation
- ✅ Basic MIDI extraction using Basic Pitch
- ✅ Simple DDSP model training pipeline
- ✅ Basic synthesis and playback
- ✅ File management and storage

### Phase 2 (Enhanced)
- 🔄 Source separation integration (Spleeter)
- 🔄 Polyphonic MIDI extraction
- 🔄 WaveTransfer-style diffusion training
- 🔄 Real-time audio preview
- 🔄 Advanced UI with waveform visualization

### Phase 3 (Production)
- ⏳ DisMix-style source-level control
- ⏳ 44.1kHz professional audio support
- ⏳ Real-time processing optimization
- ⏳ VST/AU export functionality
- ⏳ User model sharing and marketplace

## 🎨 User Interface

The application features a modern, intuitive interface with:

- **Workflow Progress Tracking**: Visual progress indicators for each step
- **Drag & Drop Audio Upload**: Easy file upload with format validation
- **Real-time Waveform Display**: Interactive audio visualization
- **Audio Player Controls**: Play, pause, seek, and loop functionality
- **Model Training Dashboard**: Real-time training progress and metrics
- **Results Comparison**: Side-by-side original vs synthesized audio

## 🔧 API Endpoints

### Audio Processing
- `POST /api/upload` - Upload audio files
- `POST /api/process/midi-extract` - Extract MIDI from audio
- `POST /api/models/train` - Train custom models
- `POST /api/synthesis/generate` - Generate synthesized audio

### Python ML Service
- `POST /midi/extract` - Polyphonic MIDI extraction
- `POST /models/train` - Custom model training
- `POST /synthesis/generate` - Audio synthesis

## 📊 Performance Targets

- **Latency**: <2 seconds for MIDI extraction, <30 seconds for model training, <5 seconds for synthesis
- **Audio Quality**: >4.0 MOS score, <0.1 spectral distortion
- **File Support**: WAV, MP3, FLAC, M4A up to 10MB
- **Concurrency**: Handle 10+ simultaneous processing requests

## 🛡️ Security & Privacy

- All audio files encrypted at rest and in transit
- Models are user-private by default
- Optional model sharing with consent
- GDPR/CCPA compliant data handling
- Rate limiting and abuse prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify** for Basic Pitch
- **Deezer** for Spleeter source separation
- **Google** for DDSP research
- **Hugging Face** for model hosting and distribution

---

**Waveridai** - Transforming audio synthesis through the power of AI 🎵✨