import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GroundingChunk } from '../types';

interface GroundingSourcesProps {
  chunks: GroundingChunk[];
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ chunks }) => {
  // Filter out chunks that don't have web URIs and deduplicate by URI
  const uniqueSources = chunks.reduce((acc, current) => {
    if (current.web?.uri && !acc.find(item => item.web?.uri === current.web?.uri)) {
      acc.push(current);
    }
    return acc;
  }, [] as GroundingChunk[]);

  if (uniqueSources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
        <ExternalLink size={12} /> Sources
      </h4>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((source, idx) => (
          <a
            key={idx}
            href={source.web?.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 hover:border-juiced-500/50 transition-all text-xs text-juiced-100 truncate max-w-[200px]"
            title={source.web?.title}
          >
            <span className="truncate">{source.web?.title || 'Web Source'}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GroundingSources;
