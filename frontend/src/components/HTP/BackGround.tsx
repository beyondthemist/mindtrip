import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cameraNear } from 'three/examples/jsm/nodes/Nodes.js';


function Background() {
  // 3d 모델
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loader = new GLTFLoader()

  // 배경
  const scene = new THREE.Scene()

  // 카메라
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 100, 1000)
  camera.position.set(10, 90, 250)
  camera.rotation.x -= 0.1

  // 조명
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // color, intensity
  directionalLight.position.set(0, 1, 2); // x, y, z
  scene.add(directionalLight);

  useEffect(() => {
    if (canvasRef.current) {
      // 렌더
      let renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })

      // 윈도우 사이즈 바껴도 계속 맞춰주기
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        // 메쉬비율 유지
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
      })

      // 배경(투명하게 설정)
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight)

      // 모델 불러오기
      loader.load('/ground.glb', function (gltf: any) {
        // 정면 볼 수 있게 돌리기
        gltf.scene.rotation.y -= 3.5
        scene.add(gltf.scene)

        // 랜더링
        renderer.render(scene, camera)

        // 카메라를 움직여보자
        function animateCamera(startPosition:THREE.Vector3 ,targetPosition:THREE.Vector3, duration:number, callback:Function|null) :void {
          const startTime:number = performance.now()
          function update() {
            const elapsedTime:number = performance.now() - startTime
            const progress:number = elapsedTime / duration
            if (progress < 1) {
              // 처음위치, 타겟위치, 얼마나 갈껀지
              camera.position.lerpVectors(startPosition, targetPosition, progress);
              requestAnimationFrame(update);
            } else {
              camera.position.copy(targetPosition);
              if (callback) callback()
            }
            renderer.render(scene, camera);
          }
          update()
        }
        animateCamera(new THREE.Vector3(10, 90, 200), new THREE.Vector3(20, 90, 150), 2000, () => {
          animateCamera(new THREE.Vector3(20, 90, 150), new THREE.Vector3(10, 90, 100), 2000, null)
        })
        
        
      }, undefined, function (err: any) {
        console.log(err)
      })
    }
  }, [])

  return (
    <div className='bg-sky-100'>
      <canvas ref={canvasRef} className='w-screen h-screen'></canvas>
    </div>
  )
}

export default Background