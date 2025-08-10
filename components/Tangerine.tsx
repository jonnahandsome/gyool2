
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Skin, TangerineMode } from '../types';
import { TANGERINE_SEGMENTS } from '../constants';

// Helper function to create a smooth SVG path from points
const pointsToSvgPath = (points: [number, number][]): string => {
  if (points.length < 2) return '';

  let path = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    path += ` Q ${p1[0]},${p1[1]} ${midPoint[0]},${midPoint[1]}`;
  }
  path += ` L ${points[points.length - 1][0]},${points[points.length - 1][1]}`;
  return path;
};

interface TangerineProps {
  skin: Skin;
  mode: TangerineMode;
  segments?: boolean[]; // true if peeled
  activeSegment?: number;
  onSegmentClick?: (index: number) => void;
  onDrawEnd?: (pathData: string) => void;
  drawnPaths?: string[];
  isDrawingDisabled?: boolean;
  gameMode?: 'speed' | 'speed-high-rank';
  isBurning?: boolean;
  isAwakened?: boolean;
  burningTouchStep?: number;
  onBurningTangerineClick?: () => void;
}

const Tangerine: React.FC<TangerineProps> = ({ 
    skin, mode, segments, activeSegment, onSegmentClick, onDrawEnd,
    drawnPaths, isDrawingDisabled, gameMode, isBurning, isAwakened, burningTouchStep, onBurningTangerineClick
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [peelEffects, setPeelEffects] = useState<{ id: number; index: number }[]>([]);
  const prevSegmentsRef = useRef<boolean[] | undefined>(undefined);

  const getPointerPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return null;
    const svgPoint = svgRef.current.createSVGPoint();
    const CTM = svgRef.current.getScreenCTM()?.inverse();
    if (!CTM) return null;

    if ('touches' in e) {
      svgPoint.x = e.touches[0].clientX;
      svgPoint.y = e.touches[0].clientY;
    } else {
      svgPoint.x = e.clientX;
      svgPoint.y = e.clientY;
    }
    const { x, y } = svgPoint.matrixTransform(CTM);
    return [x, y] as [number, number];
  }, []);

  const handleDrawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'creative-draw' || isDrawingDisabled) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPointerPosition(e);
    if (pos) setPoints([pos]);
  }, [mode, isDrawingDisabled, getPointerPosition]);

  const handleDrawMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'creative-draw' || !isDrawing || isDrawingDisabled) return;
    e.preventDefault();
    const pos = getPointerPosition(e);
    if (pos) setPoints(prev => [...prev, pos]);
  }, [isDrawing, mode, isDrawingDisabled, getPointerPosition]);

  const handleDrawEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'creative-draw' || !isDrawing || isDrawingDisabled) return;
    e.preventDefault();
    setIsDrawing(false);
    if (points.length > 1 && onDrawEnd) {
      onDrawEnd(pointsToSvgPath(points));
    }
    setPoints([]);
  }, [isDrawing, mode, points, onDrawEnd, isDrawingDisabled]);

  const segmentPaths = useMemo(() => {
    const isHighRank = gameMode === 'speed-high-rank';

    const angles: number[] = [];
    if (isHighRank) {
        let sum = 0;
        const randomValues = [];
        for (let i = 0; i < TANGERINE_SEGMENTS; i++) {
            const val = Math.random() + 0.5; // Avoid tiny segments
            randomValues.push(val);
            sum += val;
        }
        const scale = 360 / sum;
        randomValues.forEach(v => angles.push(v * scale));
    } else {
        for (let i = 0; i < TANGERINE_SEGMENTS; i++) {
            angles.push(360 / TANGERINE_SEGMENTS);
        }
    }

    let currentAngle = -90;
    return angles.map(angle => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;
        const start = [50 + 45 * Math.cos(startAngle * Math.PI / 180), 50 + 45 * Math.sin(startAngle * Math.PI / 180)];
        const end = [50 + 45 * Math.cos(endAngle * Math.PI / 180), 50 + 45 * Math.sin(endAngle * Math.PI / 180)];
        return `M50,50 L${start[0]},${start[1]} A45,45 0 0,1 ${end[0]},${end[1]} Z`;
    });
  }, [gameMode]);
  
  const segmentCenters = useMemo(() => {
    let currentAngle = -90;
    const angles = segmentPaths.map(p => {
        const match = p.match(/A45,45 0 0,1 ([\d.-]+),([\d.-]+)/);
        if (!match) return 360 / TANGERINE_SEGMENTS;
        const endX = parseFloat(match[1]);
        const endY = parseFloat(match[2]);
        const angleRad = Math.atan2(endY - 50, endX - 50);
        return angleRad * 180 / Math.PI;
    });

    return segmentPaths.map((_, i) => {
        let angle = 0;
        if (gameMode === 'speed-high-rank') {
            const pathData = segmentPaths[i];
            const startMatch = pathData.match(/L([\d.-]+),([\d.-]+)/);
            const endMatch = pathData.match(/A[\d.,\s]+ ([\d.-]+),([\d.-]+) Z/);
            if (startMatch && endMatch) {
                const startAngle = Math.atan2(parseFloat(startMatch[2]) - 50, parseFloat(startMatch[1]) - 50) * 180 / Math.PI;
                const endAngle = Math.atan2(parseFloat(endMatch[2]) - 50, parseFloat(endMatch[1]) - 50) * 180 / Math.PI;
                angle = (startAngle + endAngle) / 2;
            }
        } else {
            const anglePerSegment = 360 / TANGERINE_SEGMENTS;
            angle = -90 + anglePerSegment * i + anglePerSegment / 2;
        }
        
        const radius = 30; // Place effect slightly inside the segment
        return {
            x: 50 + radius * Math.cos(angle * Math.PI / 180),
            y: 50 + radius * Math.sin(angle * Math.PI / 180),
        };
    });
  }, [segmentPaths, gameMode]);

  useEffect(() => {
    if (mode === 'speed' && segments && prevSegmentsRef.current && skin.id === 'god-tangerine') {
        const newPeeled: number[] = [];
        for (let i = 0; i < segments.length; i++) {
            if (segments[i] && !prevSegmentsRef.current[i]) {
                newPeeled.push(i);
            }
        }
        if (newPeeled.length > 0) {
            const newEffects = newPeeled.map(index => ({ id: Date.now() + index, index }));
            setPeelEffects(current => [...current, ...newEffects]);
            setTimeout(() => {
                setPeelEffects(current => current.filter(effect => !newEffects.some(ne => ne.id === effect.id)));
            }, 500); // Duration matches animation in index.html
        }
    }
    prevSegmentsRef.current = segments;
  }, [segments, mode, skin.id]);
  
  const PeelEffect: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`} style={{ pointerEvents: 'none' }}>
      <circle r="20" fill="url(#god-glow-effect-grad)" className="animate-god-peel-effect" />
    </g>
  );

  const renderSpeedMode = () => {
     if (isBurning) {
        return (
            <div 
                className="relative w-60 h-60 sm:w-72 sm:h-72 cursor-pointer"
                onClick={() => onBurningTangerineClick?.()}
            >
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-2xl animate-pulse">
                    <defs>
                        <filter id="burn-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                            <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0 0.3 0 0 0 0 0 0 0 0 0 0 0 0 1.5 0" />
                            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>
                    {/* Base peeled tangerine */}
                    <circle cx="50" cy="50" r="45" fill={skin.color} />
                    
                    {/* The peel, which can be whole or cracked visually */}
                    <g style={{ filter: 'url(#burn-glow-strong)' }}>
                         <circle cx="50" cy="50" r="45" fill={skin.peelColor} />
                         <path d="M50,12 C 48,8 52,8 50,5" stroke="#65A30D" strokeWidth="3" fill="none" strokeLinecap="round" />
                         <circle cx="50" cy="12" r="4" fill="#84CC16" />
                    </g>
                    
                    {/* Crack effect on top for the second stage of burning */}
                    {burningTouchStep === 1 && (
                        <path d="M25,25 L75,75 M75,25 L25,75" stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round" className="opacity-0 animate-ping" style={{animationDuration: '0.5s'}}/>
                    )}
                </svg>
            </div>
        );
    }
    
    return (
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 cursor-pointer">
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full drop-shadow-lg ${isAwakened ? 'animate-pulse' : ''}`} style={{ filter: isAwakened ? 'url(#awakened-glow)' : 'none' }}>
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                 <filter id="awakened-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0.8 0 0 0 0  0 0 0 0 0  0 0 0 2 0" />
                    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <radialGradient id="god-glow-effect-grad">
                  <stop offset="0%" stopColor="rgba(253, 230, 138, 0.9)" />
                  <stop offset="100%" stopColor="rgba(253, 230, 138, 0)" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill={skin.color} />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ filter: isAwakened ? 'url(#awakened-glow)' : 'none' }}>
            {segmentPaths.map((path, i) => (
            <path
                key={i}
                d={path}
                fill={skin.peelColor}
                onClick={() => onSegmentClick?.(i)}
                className={`transition-all duration-200 ${segments?.[i] ? 'opacity-0 scale-50' : 'opacity-100 scale-100'} ${activeSegment === i && !isAwakened ? 'animate-pulse' : ''}`}
                style={{
                    filter: activeSegment === i && !isAwakened ? 'url(#glow)' : 'none',
                    fill: activeSegment === i && !isAwakened ? '#FFFF8D' : skin.peelColor,
                    transformOrigin: '50% 50%',
                }}
            />
            ))}
            {/* Stem */}
            <path d="M50,12 C 48,8 52,8 50,5" stroke="#65A30D" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="12" r="4" fill="#84CC16" />
            
            {/* Peel Effects for God Tangerine */}
            {skin.id === 'god-tangerine' && peelEffects.map(effect => {
              const center = segmentCenters[effect.index];
              return center ? <PeelEffect key={effect.id} x={center.x} y={center.y} /> : null;
            })}
        </svg>
        </div>
    );
  };
  
  const renderCreativeDrawMode = () => {
     const combinedDrawnPath = (drawnPaths ?? []).join(' ');
     return (
        <div className={`relative w-full h-full max-w-[300px] max-h-[300px] aspect-square touch-none ${isDrawingDisabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
            onMouseDown={handleDrawStart}
            onMouseMove={handleDrawMove}
            onMouseUp={handleDrawEnd}
            onMouseLeave={handleDrawEnd}
            onTouchStart={handleDrawStart}
            onTouchMove={handleDrawMove}
            onTouchEnd={handleDrawEnd}
        >
            <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <mask id="peelMask">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <path d={combinedDrawnPath} fill="black" />
                  </mask>
                </defs>

                {/* The "inside" of the tangerine */}
                <circle cx="50" cy="50" r="45" fill={skin.color} />

                {/* The peel, with drawn parts "cut out" by the mask */}
                <circle cx="50" cy="50" r="45" fill={skin.peelColor} mask="url(#peelMask)" />
                
                <path d="M50,12 C 48,8 52,8 50,5" stroke="#65A30D" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="12" r="3" fill="#84CC16" />
                
                {/* The line currently being drawn */}
                {isDrawing && points.length > 1 && (
                    <path d={pointsToSvgPath(points)} fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeDasharray="3 3" strokeLinejoin="round" strokeLinecap="round" />
                )}
            </svg>
        </div>
    );
  }

  switch (mode) {
    case 'speed':
      return renderSpeedMode();
    case 'creative-draw':
      return renderCreativeDrawMode();
    default:
      return null;
  }
};

export default Tangerine;
