import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const SPHERE_RADIUS = 30;
const STAR_COUNT = 4000;

const CIRCLE_SVG_PATH = 'M12 2a10 10 0 1 0 0.00001 0z';

const CHARACTERS = [
  {
    name: 'Darth Vader',
    color: '#dc2626',
    glowColor: '#ef4444',
    lat: 20, lon: 30,
    faction: 'Empire',
    homeworld: 'Tatooine',
    weapon: 'Red Lightsaber',
    description: 'Former Jedi Knight turned Sith Lord',
    powerLevel: 95
  },
  {
    name: 'Yoda',
    color: '#22c55e',
    glowColor: '#a7f3d0',
    lat: -10, lon: 120,
    faction: 'Jedi Order',
    homeworld: 'Dagobah',
    weapon: 'Green Lightsaber',
    description: 'Legendary Jedi Master, wise and powerful',
    powerLevel: 98
  },
  {
    name: 'Luke Skywalker',
    color: '#60a5fa',
    glowColor: '#bae6fd',
    lat: 40, lon: -60,
    faction: 'Rebellion',
    homeworld: 'Tatooine',
    weapon: 'Blue Lightsaber',
    description: 'Hero of the Rebellion, Jedi Knight',
    powerLevel: 92
  },
  {
    name: 'Leia Organa',
    color: '#ffe81f',
    glowColor: '#fff9c4',
    lat: -30, lon: 60,
    faction: 'Rebellion',
    homeworld: 'Alderaan',
    weapon: 'Blaster',
    description: 'Princess, Rebel leader, and diplomat',
    powerLevel: 85
  },
  {
    name: 'Han Solo',
    color: '#f59e42',
    glowColor: '#fbbf24',
    lat: 10, lon: -120,
    faction: 'Rebellion',
    homeworld: 'Corellia',
    weapon: 'Blaster',
    description: 'Smuggler, pilot of the Millennium Falcon',
    powerLevel: 80
  },
  {
    name: 'Chewbacca',
    color: '#a16207',
    glowColor: '#fde68a',
    lat: 0, lon: 0,
    faction: 'Rebellion',
    homeworld: 'Kashyyyk',
    weapon: 'Bowcaster',
    description: "Wookiee warrior and Han Solo's loyal friend",
    powerLevel: 82
  },
  {
    name: 'R2-D2',
    color: '#60a5fa',
    glowColor: '#bae6fd',
    lat: 50, lon: 100,
    faction: 'Rebellion',
    homeworld: 'Naboo',
    weapon: 'Tools & Gadgets',
    description: 'Astromech droid, loyal and resourceful',
    powerLevel: 70
  },
  {
    name: 'C-3PO',
    color: '#fbbf24',
    glowColor: '#fef08a',
    lat: -40, lon: -80,
    faction: 'Rebellion',
    homeworld: 'Tatooine',
    weapon: 'Protocol',
    description: 'Protocol droid fluent in over six million forms of communication',
    powerLevel: 60
  },
  {
    name: 'Obi-Wan Kenobi',
    color: '#3b82f6',
    glowColor: '#a5b4fc',
    lat: 25, lon: -150,
    faction: 'Jedi Order',
    homeworld: 'Stewjon',
    weapon: 'Blue Lightsaber',
    description: 'Jedi Master, mentor to Anakin and Luke',
    powerLevel: 90
  },
  {
    name: 'Emperor Palpatine',
    color: '#a3a3a3',
    glowColor: '#f3f4f6',
    lat: -25, lon: 150,
    faction: 'Empire',
    homeworld: 'Naboo',
    weapon: 'Force Lightning',
    description: 'Sith Lord, Emperor of the Galactic Empire',
    powerLevel: 97
  },
  {
    name: 'Boba Fett',
    color: '#22d3ee',
    glowColor: '#67e8f9',
    lat: 60, lon: 60,
    faction: 'Bounty Hunter',
    homeworld: 'Kamino',
    weapon: 'Blaster Rifle',
    description: 'Infamous bounty hunter, Mandalorian armor',
    powerLevel: 83
  },
  {
    name: 'Rey',
    color: '#f472b6',
    glowColor: '#fbcfe8',
    lat: -50, lon: 80,
    faction: 'Resistance',
    homeworld: 'Jakku',
    weapon: 'Blue Lightsaber',
    description: 'Scavenger, Jedi, last hope of the Resistance',
    powerLevel: 89
  },
  {
    name: 'Kylo Ren',
    color: '#a3a3a3',
    glowColor: '#f87171',
    lat: 35, lon: -100,
    faction: 'First Order',
    homeworld: 'Chandrila',
    weapon: 'Red Crossguard Lightsaber',
    description: 'Dark side Force user, conflicted legacy',
    powerLevel: 88
  },
  {
    name: 'Padmé Amidala',
    color: '#f472b6',
    glowColor: '#fbcfe8',
    lat: -55, lon: 30,
    faction: 'Republic',
    homeworld: 'Naboo',
    weapon: 'Blaster',
    description: 'Queen and later Senator of Naboo',
    powerLevel: 75
  },
  {
    name: 'Mace Windu',
    color: '#a78bfa',
    glowColor: '#ddd6fe',
    lat: 15, lon: 170,
    faction: 'Jedi Order',
    homeworld: 'Haruun Kal',
    weapon: 'Purple Lightsaber',
    description: 'Jedi Master, member of the High Council',
    powerLevel: 91
  },
];

const fallbackImg = '/assets/yoda.png';

// Function to generate a Star Wars-style sphere SVG path with grid overlay and soft glow
function getSphereSVGPath(color: string, glowColor?: string) {
  const gradientId = `grad-${color.replace('#', '')}`;
  return `
    <svg width="128" height="128" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="${color}" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="${glowColor || color}" stop-opacity="0.0"/>
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#${gradientId})" filter="url(#glow)" />
      <circle cx="12" cy="12" r="7" fill="#fff" opacity="0.12" />
      <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.18" />
      <circle cx="12" cy="12" r="3" fill="#fff" opacity="0.25" />
      <g stroke="#fff" stroke-width="0.5" opacity="0.18">
        <ellipse cx="12" cy="12" rx="10" ry="3" />
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <ellipse cx="12" cy="12" rx="10" ry="9" />
        <ellipse cx="12" cy="12" rx="5" ry="10" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="5" ry="10" transform="rotate(-30 12 12)" />
      </g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="${glowColor || color}" stroke-width="1.5" opacity="0.5" filter="url(#glow)" />
    </svg>
  `;
}

// Function to create SVG texture with glow and grid
function createSVGTextureWithGrid(color: string, glowColor?: string) {
  const svgMarkup = getSphereSVGPath(color, glowColor);
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const texture = new THREE.TextureLoader().load(url, () => {
    texture.needsUpdate = true;
  });
  return texture;
}

const GalaxyMap: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      // Starfield
      const starGeometry = new THREE.BufferGeometry();
      const starVertices = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 200 + Math.random() * 200;
        starVertices.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // Sphere (the map) - make it more visible
      const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a2e,
        shininess: 30,
        specular: 0x444466,
        flatShading: false,
        transparent: true,
        opacity: 0.9,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

      // Sphere blue glow - make it more prominent
      const glowGeometry = new THREE.SphereGeometry(SPHERE_RADIUS * 1.05, 64, 64);
      const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x7ec0ee, transparent: true, opacity: 0.2 });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      scene.add(glow);

      // Additional outer glow
      const outerGlowGeometry = new THREE.SphereGeometry(SPHERE_RADIUS * 1.1, 64, 64);
      const outerGlowMaterial = new THREE.MeshBasicMaterial({ color: 0x7ec0ee, transparent: true, opacity: 0.1 });
      const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
      scene.add(outerGlow);

      // Lighting - improve visibility
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const pointLight = new THREE.PointLight(0xffffff, 1.5, 400);
      pointLight.position.set(0, 0, SPHERE_RADIUS * 3);
      scene.add(pointLight);

      // Add directional light for better character visibility
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(SPHERE_RADIUS * 2, SPHERE_RADIUS * 2, SPHERE_RADIUS * 2);
      scene.add(directionalLight);

      // Character Sprites with SVG - improved positioning and visibility
      const spriteMeshes: THREE.Sprite[] = [];
      CHARACTERS.forEach(char => {
        const lat = typeof char.lat === 'number' ? char.lat : 0;
        const lon = typeof char.lon === 'number' ? char.lon : 0;
        
        // Convert lat/lon to 3D coordinates on sphere surface
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        // Calculate position on sphere surface with offset to ensure sprites hover above the sphere
        const offset = 4.0; // Set offset to 4 for moderate separation
        const x = (SPHERE_RADIUS + offset) * Math.sin(phi) * Math.cos(theta);
        const y = (SPHERE_RADIUS + offset) * Math.cos(phi);
        const z = (SPHERE_RADIUS + offset) * Math.sin(phi) * Math.sin(theta);
        
        if (char.color) {
          const texture = createSVGTextureWithGrid(char.color, char.glowColor);
          const material = new THREE.SpriteMaterial({ 
            map: texture, 
            color: 0xffffff, 
            transparent: true, 
            opacity: 1.0,
            sizeAttenuation: true
          });
          const sprite = new THREE.Sprite(material);
          sprite.position.set(x, y, z);
          sprite.scale.set(5, 5, 1); // Smaller, more distinct
          sprite.userData = char;
          scene.add(sprite);
          spriteMeshes.push(sprite);
        }
      });

      // Camera - adjust for better view
      const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
      camera.position.z = SPHERE_RADIUS * 2.5;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = true;
      controls.minDistance = SPHERE_RADIUS * 1.5;
      controls.maxDistance = SPHERE_RADIUS * 8;
      controls.autoRotate = false;

      // Raycaster for hover/click
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      function onPointerMove(e: MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(spriteMeshes);
        if (intersects.length > 0) {
          const obj = intersects[0].object as THREE.Sprite;
          setHovered(obj.userData.name);
          setHoveredPosition({ x: e.clientX, y: e.clientY });
          // Pop out effect for hovered sprite
          spriteMeshes.forEach(sprite => {
            if (sprite.userData.name === obj.userData.name) {
              sprite.scale.set(8, 8, 1); // Make hovered sprite larger
              (sprite.material as THREE.SpriteMaterial).opacity = 1.0;
            } else {
              sprite.scale.set(5, 5, 1);
              (sprite.material as THREE.SpriteMaterial).opacity = 0.9;
            }
          });
        } else {
          setHovered(null);
          setHoveredPosition(null);
          // Reset all sprites
          spriteMeshes.forEach(sprite => {
            sprite.scale.set(5, 5, 1);
            (sprite.material as THREE.SpriteMaterial).opacity = 0.9;
          });
        }
      }
      
      renderer.domElement.addEventListener('mousemove', onPointerMove);

      // Handle window resize
      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);

      // Animate
      let t = 0;
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        t += 0.01;
        // Animate starfield: drift
        const positions = starGeometry.attributes.position.array;
        for (let i = 0; i < STAR_COUNT; i++) {
          positions[i * 3 + 0] += Math.sin(t + i) * 0.002;
          positions[i * 3 + 1] += Math.cos(t + i) * 0.002;
        }
        starGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      }
      
      animate();
      setIsLoading(false);

      return () => {
        renderer.dispose();
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
        }
        renderer.domElement.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error('Error initializing GalaxyMap:', err);
      setError('Failed to load the galaxy map. Please refresh the page.');
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'black', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#dc2626',
        fontFamily: '"Star Jedi", "Arial Black", Arial, sans-serif'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>GALAXY MAP ERROR</div>
        <div style={{ fontSize: '16px', marginBottom: '30px', textAlign: 'center' }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '16px'
          }}
        >
          RELOAD MAP
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: 'black' }}>
      {/* Navigation Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontFamily: '"Star Jedi", "Arial Black", Arial, sans-serif',
          color: '#ffe81f',
          fontSize: '28px',
          letterSpacing: '2px',
          textShadow: '0 0 10px #ffe81f'
        }}>
          GALAXY MAP
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#dc2626',
            color: 'white',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontFamily: '"Star Jedi", "Arial Black", Arial, sans-serif',
            fontSize: '16px',
            letterSpacing: '1px',
            transition: 'all 0.2s',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.5)';
          }}
        >
          RETURN TO BASE
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            fontFamily: '"Star Jedi", "Arial Black", Arial, sans-serif',
            color: '#ffe81f',
            fontSize: '24px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            INITIALIZING GALAXY MAP
          </div>
          <div style={{
            width: '200px',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #ffe81f, #dc2626)',
              animation: 'loading 2s infinite'
            }} />
          </div>
        </div>
      )}

      {/* 3D Scene Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Character Info Tooltip */}
      {hovered && hoveredPosition && (() => {
        const character = CHARACTERS.find(c => c.name === hovered);
        if (!character) return null;
        
        const factionColors: { [key: string]: string } = {
          'Empire': '#dc2626',
          'Jedi Order': '#22c55e',
          'Rebellion': '#ffe81f',
          'First Order': '#a3a3a3',
          'Resistance': '#60a5fa',
          'Bounty Hunter': '#22d3ee',
          'Republic': '#f59e42',
          'default': '#ef4444'
        };
        
        let mainColor = factionColors['default'];
        if (typeof character.faction === 'string' && factionColors[character.faction as string]) {
          mainColor = factionColors[character.faction as string];
        }
        
        const powerBarColor = character.weapon && character.weapon.toLowerCase().includes('red') ? '#dc2626' : mainColor;
        
        return (
          <div style={{
            position: 'absolute',
            left: Math.min(hoveredPosition.x + 10, window.innerWidth - 350),
            top: Math.max(hoveredPosition.y - 10, 100),
            background: 'rgba(10,10,20,0.98)',
            color: mainColor,
            border: `2.5px solid ${mainColor}`,
            borderRadius: '16px',
            padding: '24px 36px',
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '1.2px',
            boxShadow: `0 0 32px 4px ${mainColor}, 0 0 80px 8px ${mainColor}33`,
            zIndex: 1000,
            fontFamily: '"Star Jedi", "Arial Black", Arial, sans-serif',
            textShadow: `0 0 8px ${mainColor}, 0 0 16px #000`,
            backdropFilter: 'blur(8px)',
            minWidth: '340px',
            maxWidth: '400px',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
            borderImage: `linear-gradient(90deg, ${mainColor} 0%, #fff 100%) 1`,
            boxSizing: 'border-box',
          }}>
            <div style={{
              marginBottom: '18px',
              fontSize: '28px',
              textAlign: 'center',
              borderBottom: `2px solid ${mainColor}`,
              paddingBottom: '12px',
              background: `linear-gradient(90deg, transparent, ${mainColor}22, transparent)`,
              borderRadius: '6px',
              letterSpacing: '2px',
              textShadow: `0 0 12px ${mainColor}, 0 0 24px #000`
            }}>{character.name}</div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700, opacity: 0.7 }}>FACTION: </span>
              <span style={{ color: mainColor, fontSize: '15px', fontWeight: 700 }}>{character.faction}</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700, opacity: 0.7 }}>HOMEWORLD: </span>
              <span style={{ color: mainColor, fontSize: '15px', fontWeight: 700 }}>{character.homeworld}</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700, opacity: 0.7 }}>WEAPON: </span>
              <span style={{ color: powerBarColor, fontSize: '15px', fontWeight: 700 }}>{character.weapon}</span>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700, opacity: 0.7 }}>POWER: </span>
              <div style={{
                display: 'inline-block',
                width: '110px',
                height: '10px',
                background: '#1a1a2e',
                borderRadius: '5px',
                marginLeft: '12px',
                marginRight: '8px',
                boxShadow: `0 0 8px ${powerBarColor}99`
              }}>
                <div style={{
                  width: `${character.powerLevel}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${powerBarColor}, #fff 90%)`,
                  borderRadius: '5px',
                  boxShadow: `0 0 16px 2px ${powerBarColor}`
                }} />
              </div>
              <span style={{ color: powerBarColor, fontSize: '15px', fontWeight: 700 }}>{character.powerLevel}%</span>
            </div>
            <div style={{
              marginTop: '18px',
              paddingTop: '12px',
              borderTop: `1.5px solid ${mainColor}`,
              fontSize: '15px',
              color: '#fff',
              fontStyle: 'italic',
              lineHeight: '1.5',
              opacity: 0.85,
              textShadow: `0 0 6px ${mainColor}99`
            }}>
              {character.description}
            </div>
          </div>
        );
      })()}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.7)',
        color: '#ffe81f',
        padding: '12px 24px',
        borderRadius: '8px',
        fontFamily: '"Star Jedi", "Arial Black", Arial, sans-serif',
        fontSize: '14px',
        letterSpacing: '1px',
        textAlign: 'center',
        zIndex: 1000
      }}>
        HOVER OVER CHARACTERS • DRAG TO ROTATE • SCROLL TO ZOOM
      </div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default GalaxyMap; 