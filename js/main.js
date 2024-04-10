import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

function init(){
    const div = document.getElementById("content")
    const canvas = document.getElementById("main")

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, div.offsetWidth / div.offsetHeight, 0.1, 1000)
    camera.position.z = 2;
    scene.add(camera)

    const cubeG = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const mat = new THREE.MeshBasicMaterial({color: 0xAAAAAA})
    const cube = new THREE.Mesh(cubeG, mat)
    cube.rotation.x = -1
    scene.add(cube)

    const planeG = new THREE.PlaneGeometry(1, 10)
    const matP = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
    const floor = new THREE.Mesh(planeG, matP)
    floor.rotation.x = -1
    scene.add(floor)

    const alight = new THREE.AmbientLight(0xFFFFFF, 2)
    scene.add(alight)

    const controls = new OrbitControls(camera, canvas)
    controls.enablePan = false;
    controls.update()

    const loader = new GLTFLoader()

    loader.load(
        '/assets/ux_1/main.glb',
        function (gltf){
            const obg = gltf.scene
            obg.position.x = -1.2
            obg.position.y = -0.5
            scene.add(obg)
        }
    )

    loader.load(
        '/assets/ux_2/main.glb',
        function (gltf){
            const obg = gltf.scene
            obg.position.x = 1.2
            obg.position.y = 2
            obg.position.z = -1.5
            scene.add(obg)
        }
    )

    loader.load(
        '/assets/ux_3/main.glb',
        function (gltf){
            const obg = gltf.scene
            obg.position.x = -1.2
            obg.position.y = -1.6
            obg.position.z = 1.5
            obg.rotation.y = 2
            scene.add(obg)
        }
    )

    const rend = new THREE.WebGLRenderer({canvas});
    rend.setSize(div.offsetWidth, div.offsetHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace

    window.addEventListener('resize', () => {
        camera.aspect = div.offsetWidth / div.offsetHeight;
        camera.updateProjectionMatrix();
        rend.setSize(div.offsetWidth, div.offsetHeight);
    })

    function update(){
        requestAnimationFrame(update)
        rend.render(scene, camera)
        controls.update
    }

    update()
}

init()