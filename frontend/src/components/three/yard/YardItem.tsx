/**
 * YardItem - 드래그 가능한 야적장 물건
 *
 * Box, Hexagon, Circle 형태 지원
 * 드래그 중 반투명, 점선 테두리 표시
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { YardItem as YardItemType } from '../../../types/yard.types';
import { YARD_SCALE } from '../../../constants/yardLayout';

interface YardItemProps {
  item: YardItemType;
  isSelected: boolean;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, pos: [number, number, number]) => void;
  onDragEnd: (id: string) => void;
}

const HEIGHT = 0.1; // 물건 높이 (월드 유닛)

export function YardItem({ item, isSelected, onDragStart, onDragMove, onDragEnd }: YardItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const itemIdRef = useRef(item.id);
  itemIdRef.current = item.id;

  const w = item.width * YARD_SCALE;
  const l = item.length * YARD_SCALE;

  /** 스크린 좌표 → 바닥 평면 교차점 */
  const getGroundPoint = useCallback((clientX: number, clientY: number): THREE.Vector3 | null => {
    const rect = gl.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.current.setFromCamera(pointer, camera);
    const target = new THREE.Vector3();
    const hit = raycaster.current.ray.intersectPlane(groundPlane.current, target);
    return hit ? target : null;
  }, [camera, gl]);

  const handlePointerDown = (e: THREE.Event & { stopPropagation: () => void }) => {
    e.stopPropagation();
    const pe = e as unknown as PointerEvent;

    // 바닥 교차점과 현재 아이템 위치의 오프셋 저장
    const hitPoint = getGroundPoint(pe.clientX, pe.clientY);
    if (!hitPoint) return;

    dragOffset.current.set(
      item.position[0] - hitPoint.x,
      0,
      item.position[2] - hitPoint.z,
    );

    setIsDragging(true);
    onDragStart(item.id);
    gl.domElement.style.cursor = 'grabbing';
  };

  // window 이벤트로 드래그 처리 (mesh 이벤트 피드백 루프 방지)
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const hitPoint = getGroundPoint(e.clientX, e.clientY);
      if (!hitPoint) return;
      onDragMove(itemIdRef.current, [
        hitPoint.x + dragOffset.current.x,
        item.position[1],
        hitPoint.z + dragOffset.current.z,
      ]);
    };

    const handleWindowPointerUp = () => {
      setIsDragging(false);
      onDragEnd(itemIdRef.current);
      gl.domElement.style.cursor = 'auto';
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [isDragging, getGroundPoint, onDragMove, onDragEnd, gl, item.position]);

  const opacity = isDragging ? 0.6 : 1;

  return (
    <group
      position={item.position}
      rotation={[0, item.rotationY, 0]}
    >
      {/* 메인 형태 */}
      {item.itemType === 'BOX' && (
        <mesh
          ref={meshRef}
          onPointerDown={handlePointerDown}
          castShadow
        >
          <boxGeometry args={[w, HEIGHT, l]} />
          <meshLambertMaterial
            color={item.color}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {item.itemType === 'HEXAGON' && (
        <mesh
          ref={meshRef}
          onPointerDown={handlePointerDown}
          castShadow
        >
          <cylinderGeometry args={[w / 2, w / 2, HEIGHT, 6]} />
          <meshLambertMaterial
            color={item.color}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {item.itemType === 'CIRCLE' && (
        <mesh
          ref={meshRef}
          onPointerDown={handlePointerDown}
          castShadow
        >
          <cylinderGeometry args={[w / 2, w / 2, HEIGHT, 32]} />
          <meshLambertMaterial
            color={item.color}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {/* 선택 표시 - 테두리 */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[w + 0.02, HEIGHT + 0.02, l + 0.02]} />
          <meshBasicMaterial color="#FFFFFF" wireframe />
        </mesh>
      )}
    </group>
  );
}
