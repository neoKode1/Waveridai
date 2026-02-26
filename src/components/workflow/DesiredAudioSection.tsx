'use client'

import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface DesiredAudioSectionProps {
  desiredAudioDescription: string;
  onChange: (description: string) => void;
}

export const DesiredAudioSection: React.FC<DesiredAudioSectionProps> = ({
  desiredAudioDescription,
  onChange,
}) => {
  const examplePrompts = [
    'A upbeat jazz piano solo with swing rhythm',
    'Ambient electronic soundscape with ethereal pads',
    'Classical string quartet playing a melancholic piece',
    'Energetic rock guitar riff with distortion',
  ];

  return (
    <div className="card">
      <div className="flex items-start space-x-4 mb-6">
        <div className="p-3 gradient-secondary rounded-lg">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 text-white">Describe Your Music</h2>
          <p className="text-neutral-400">
            Tell our AI what kind of music you want to create. Be as specific or creative as you like.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="music-prompt" className="block text-sm font-medium text-neutral-300 mb-2">
            Music Prompt
          </label>
          <textarea
            id="music-prompt"
            value={desiredAudioDescription}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe the music you want to create..."
            rows={4}
            className="w-full input resize-none focus:ring-secondary-500"
          />
        </div>

        <div>
          <p className="text-sm text-neutral-400 mb-3 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-secondary-400" />
            <span>Try these examples:</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onChange(prompt)}
                className="text-left p-3 rounded-lg bg-secondary-500/5 hover:bg-secondary-500/10 border border-secondary-500/20 hover:border-secondary-500/40 transition-all duration-200 text-sm text-neutral-300 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
