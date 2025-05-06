// Add global interface declaration at the top to extend Window
declare global {
  interface Window {
    componentData?: {
      positions: Array<{x: number, y: number}>;
      types: boolean[];
    };
  }
}

'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Store CPU elements in a ref to keep them stable across renders
  const cpuElementsRef = useRef<{x: number, y: number, rotation: number, scale: number}[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Circuit nodes and paths - reduced count for better performance
    const nodes: {x: number, y: number, type: 'node' | 'ic', size: number, color: string}[] = [];
    const connections: {from: number, to: number, progress: number, speed: number, active: boolean, lifetime: number}[] = [];
    const gridSize = 250; // Further increased grid size for fewer elements
    
    // Choose colors based on theme - improved for readability
    const lineColor = isDark ? 'rgba(228, 169, 81, 0.15)' : 'rgba(59, 130, 246, 0.2)';
    const flowingCurrentColor = isDark ? '#f0b866' : '#2563eb'; // Circuit trace color
    const nodeColor = isDark ? '#78baff' : '#2563eb'; // Brighter blue in dark mode, darker in light mode
    const icColor = isDark ? '#f8c66d' : '#d97706'; // Brighter copper in dark mode, darker gold in light mode
    
    // Generate fewer grid points with more spacing
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        // Only place nodes with 15% probability to significantly reduce density
        // Use different probabilities for different screen regions to reduce right side density
        const screenPosition = x / canvas.width;
        const nodeProbability = screenPosition > 0.65 ? 0.90 : 0.85; // Reduce nodes on right side even more
        
        if (Math.random() > nodeProbability) {
          // Add some randomness to position
          const offsetX = Math.random() * 60 - 30;
          const offsetY = Math.random() * 60 - 30;
          
          // Simpler component types - just nodes and ICs
          const type = Math.random() > 0.8 ? 'ic' : 'node';
          
          // Size based on type
          const size = type === 'ic' ? 6 : 2;
          
          // Component color
          const color = type === 'ic' ? icColor : nodeColor;
          
          nodes.push({
            x: x + offsetX,
            y: y + offsetY,
            type,
            size,
            color
          });
        }
      }
    }
    
    // Function to create a new random connection
    const createRandomConnection = () => {
      if (nodes.length < 2) return null;
      
      // Pick random source node
      const sourceIndex = Math.floor(Math.random() * nodes.length);
      const sourceNode = nodes[sourceIndex];
      
      // Skip more connections on the right side of the screen
      const nodeXPercent = sourceNode.x / canvas.width;
      if (nodeXPercent > 0.65 && Math.random() > 0.3) {
        return null; // Skip connections for 70% of nodes on the right side
      }
      
      // Find potential target nodes based on distance
      const potentialTargets = [];
      for (let j = 0; j < nodes.length; j++) {
        if (sourceIndex === j) continue;
        
        const dx = sourceNode.x - nodes[j].x;
        const dy = sourceNode.y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only consider connections within a reasonable range
        if (distance < gridSize * 1.5 && distance > gridSize * 0.5) {
          potentialTargets.push({
            index: j,
            distance: distance
          });
        }
      }
      
      if (potentialTargets.length === 0) return null;
      
      // Sort by distance and pick one of the closest nodes randomly
      potentialTargets.sort((a, b) => a.distance - b.distance);
      const maxTargets = Math.min(3, potentialTargets.length);
      const targetData = potentialTargets[Math.floor(Math.random() * maxTargets)];
      
      // Calculate target node position as percentage of screen width
      const targetXPercent = nodes[targetData.index].x / canvas.width;
      
      // Add additional filter for connections on the right side
      if ((nodeXPercent > 0.6 || targetXPercent > 0.6) && Math.random() > 0.5) {
        return null; // Skip 50% of connections involving right side
      }
      
      // Create new connection
      return {
        from: sourceIndex,
        to: targetData.index,
        progress: -Math.random() * 20, // Start with a small delay
        speed: 0.02 + Math.random() * 0.15, // Speed varies for more natural look
        active: true,
        lifetime: 1 // Will be removed after completion
      };
    };
    
    // Initialize with a few initial connections
    const initialConnectionCount = Math.min(10, Math.floor(nodes.length * 0.1));
    for (let i = 0; i < initialConnectionCount; i++) {
      const connection = createRandomConnection();
      if (connection) connections.push(connection);
    }
    
    // Create CPU/circuit board decorative element positions if not already created
    if (cpuElementsRef.current.length === 0) {
      // Position CPUs in opposite corners for balance
      cpuElementsRef.current.push({
        x: canvas.width * 0.15, 
        y: canvas.height * 0.85,
        rotation: Math.PI / 12, // Slight rotation
        scale: 1.3, // Fixed scale, no random variation
      });
      
      cpuElementsRef.current.push({
        x: canvas.width * 0.85, 
        y: canvas.height * 0.25,
        rotation: -Math.PI / 8, // Different rotation
        scale: 1.2, // Fixed scale, no random variation
      });
    } else {
      // Update positions if window was resized
      cpuElementsRef.current[0].x = canvas.width * 0.15;
      cpuElementsRef.current[0].y = canvas.height * 0.85;
      cpuElementsRef.current[1].x = canvas.width * 0.85;
      cpuElementsRef.current[1].y = canvas.height * 0.25;
    }
    
    // Draw a decorative CPU/Circuit board
    const drawCPU = (x: number, y: number, scale = 1, rotation = 0) => {
      const size = 180 * scale; // Increased base size from 140 to 180
      const halfSize = size / 2;
      
      // Save current context state
      ctx.save();
      
      // Translate and rotate
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Draw the CPU board - slightly transparent
      ctx.fillStyle = isDark ? 'rgba(28, 42, 60, 0.35)' : 'rgba(226, 232, 240, 0.35)';
      ctx.fillRect(-halfSize, -halfSize, size, size);
      
      // Draw the outer border
      ctx.strokeStyle = isDark ? 'rgba(228, 169, 81, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-halfSize, -halfSize, size, size);
      
      // Draw the CPU chip in the center
      const chipSize = size * 0.45;
      const chipHalfSize = chipSize / 2;
      ctx.fillStyle = isDark ? 'rgba(43, 53, 71, 0.7)' : 'rgba(203, 213, 225, 0.7)';
      ctx.fillRect(-chipHalfSize, -chipHalfSize, chipSize, chipSize);
      
      // CPU markings/chip details
      ctx.strokeStyle = isDark ? 'rgba(248, 198, 109, 0.7)' : 'rgba(37, 99, 235, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-chipHalfSize, -chipHalfSize, chipSize, chipSize);
      
      // Draw pins around the CPU
      const pinLength = 8 * scale;
      const pinWidth = 1.5 * scale;
      const pinColor = isDark ? 'rgba(228, 169, 81, 0.6)' : 'rgba(59, 130, 246, 0.6)';
      
      // Pin spacing
      const pinSpacing = size * 0.08;
      const pinStart = -halfSize + size * 0.15;
      const pinCount = Math.floor((size * 0.7) / pinSpacing);
      
      // Draw pins
      ctx.fillStyle = pinColor;
      
      // Top and bottom pins
      for (let i = 0; i < pinCount; i++) {
        const pinX = pinStart + i * pinSpacing;
        
        // Top pins
        ctx.fillRect(pinX, -halfSize, pinWidth, pinLength);
        
        // Bottom pins
        ctx.fillRect(pinX, halfSize - pinLength, pinWidth, pinLength);
      }
      
      // Left and right pins
      for (let i = 0; i < pinCount; i++) {
        const pinY = pinStart + i * pinSpacing;
        
        // Left pins
        ctx.fillRect(-halfSize, pinY, pinLength, pinWidth);
        
        // Right pins
        ctx.fillRect(halfSize - pinLength, pinY, pinLength, pinWidth);
      }
      
      // Add animated inner traces for the CPU board
      const now = Date.now() / 1000; // Current time in seconds for animation
      
      // Draw circuit traces with subtle animation
      ctx.strokeStyle = isDark ? 'rgba(120, 186, 255, 0.25)' : 'rgba(37, 99, 235, 0.25)';
      ctx.lineWidth = 0.8 * scale;
      
      // Horizontal traces
      for (let i = 1; i < 4; i++) {
        const traceY = -halfSize + (size / 4) * i;
        ctx.beginPath();
        ctx.moveTo(-halfSize + 10 * scale, traceY);
        ctx.lineTo(halfSize - 10 * scale, traceY);
        ctx.stroke();
      }
      
      // Vertical traces
      for (let i = 1; i < 4; i++) {
        const traceX = -halfSize + (size / 4) * i;
        ctx.beginPath();
        ctx.moveTo(traceX, -halfSize + 10 * scale);
        ctx.lineTo(traceX, halfSize - 10 * scale);
        ctx.stroke();
      }
      
      // Restore context
      ctx.restore();
    };
    
    function draw() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.lineWidth = isDark ? 1.2 : 1.0; // Slightly thicker lines in dark mode
      
      // Draw static connections
      for (let i = 0; i < connections.length; i++) {
        const connection = connections[i];
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];
        
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = lineColor;
          ctx.stroke();
        
        // Draw the flowing current animation
        if (connection.active && connection.progress >= 0) {
          // Calculate point based on progress
          const progress = Math.min(connection.progress, 1);
          const x = fromNode.x + (toNode.x - fromNode.x) * progress;
          const y = fromNode.y + (toNode.y - fromNode.y) * progress;
          
          // Draw the animated dot at the current position
          ctx.beginPath();
          ctx.arc(x, y, fromNode.type === 'ic' || toNode.type === 'ic' ? 2 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = flowingCurrentColor;
          ctx.fill();
          
          // Update progress
        connection.progress += connection.speed;
        
          // Reset when complete
          if (connection.progress > 1) {
            connection.lifetime--;
          
          if (connection.lifetime <= 0) {
              // Remove this connection by settings its active status to false
            connection.active = false;
          } else {
              // Restart the animation
              connection.progress = 0;
            }
          }
        }
      }
      
      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        if (node.type === 'ic') {
          // Draw small square for ICs
          ctx.fillStyle = node.color;
          ctx.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
        } else {
          // Draw circle for regular nodes
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();
        }
      }
      
      // Draw the decorative CPU elements
      for (const cpuElement of cpuElementsRef.current) {
        drawCPU(cpuElement.x, cpuElement.y, cpuElement.scale, cpuElement.rotation);
      }
      
      // Remove inactive connections and add new ones
      const newConnections = connections.filter(conn => conn.active);
          
      // Create new connections more slowly - a small chance of a new connection per frame
      // Lower chance in light mode for less busy appearance
      const connectionChance = isDark ? 0.02 : 0.015;
      
      if (Math.random() < connectionChance && connections.length < 30) { // limit max active connections
        const newConnection = createRandomConnection();
        if (newConnection) newConnections.push(newConnection);
      }
      
      // Update connections array
      connections.length = 0;
      connections.push(...newConnections);
      
      requestAnimationFrame(draw);
    }
    
    draw();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Update CPU positions on resize
      if (cpuElementsRef.current.length > 0) {
        cpuElementsRef.current[0].x = canvas.width * 0.15;
        cpuElementsRef.current[0].y = canvas.height * 0.85;
        
        if (cpuElementsRef.current.length > 1) {
          cpuElementsRef.current[1].x = canvas.width * 0.85;
          cpuElementsRef.current[1].y = canvas.height * 0.25;
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[-2]" 
      style={{ opacity: isDark ? 0.3 : 0.2 }}
    />
  );
}
