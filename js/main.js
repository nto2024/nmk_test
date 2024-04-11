import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

function init(){
    //инициализация объектов, где проходит рендер
    const div = document.getElementById("content")
    const canvas = document.getElementById("main")

    //инициализация сцены и камеры
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, div.offsetWidth / div.offsetHeight, 0.1, 1000)
    camera.position.y = 2;
    camera.position.z = 2
    scene.add(camera)

    //создание полванки персонажа
    const cubeG = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const mat = new THREE.MeshBasicMaterial({color: 0xAAAAAA})
    const cube = new THREE.Mesh(cubeG, mat)
    cube.position.y = 0.25
    scene.add(cube)

    //создание болванки пола
    const planeG = new THREE.PlaneGeometry(1, 10)
    const matP = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
    const floor = new THREE.Mesh(planeG, matP)
    floor.rotation.x = -0.5 * Math.PI
    floor.position.z = -3.5
    scene.add(floor)

    //добавление света
    const alight = new THREE.AmbientLight(0xFFFFFF, 2)
    scene.add(alight)

    //создание контроллеров для теста окружения
    // const controls = new OrbitControls(camera, canvas)
    // controls.enablePan = false;
    // // controls.enableRotate = false
    // controls.update()

    //подгрузка моделей окружения
    const loader = new GLTFLoader()

    loader.load(
        '/assets/ux_1/main.glb',
        function (gltf){
            const obj = gltf.scene
            obj.position.x = -1.2
            obj.position.y = -0.5
            scene.add(obj)
        }
    )

    loader.load(
        '/assets/ux_2/main.glb',
        function (gltf){
            const obj = gltf.scene
            obj.position.x = 1.2
            obj.position.y = 2
            obj.position.z = -1.5
            scene.add(obj)
        }
    )

    loader.load(
        '/assets/ux_3/main.glb',
        function (gltf){
            const obj = gltf.scene
            obj.position.x = -1.2
            obj.position.y = -1.6
            obj.position.z = 1.5
            obj.rotation.y = 2
            scene.add(obj)
        }
    )

    //рендер для сцены
    const rend = new THREE.WebGLRenderer({canvas});
    rend.setSize(div.offsetWidth, div.offsetHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace

    const w = document.getElementById("w")
    const css = new CSS3DRenderer(w)
    css.setSize(100, 100, 100)
    // css.position.y = 2
    scene.add(css)

    //изменения если изменился размер окна
    window.addEventListener('resize', () => {
        camera.aspect = div.offsetWidth / div.offsetHeight;
        camera.updateProjectionMatrix();
        rend.setSize(div.offsetWidth, div.offsetHeight);
    })

    window.addEventListener('keydown', function(event){
        if (event.code === 'KeyW'){
            cube.position.z -= 0.05
            camera.position.z -= 0.05
            cube.rotation.y = -Math.PI
        }
        if (event.code === 'KeyS'){
            cube.position.z += 0.05
            camera.position.z += 0.05
            cube.rotation.y = Math.PI
        }
    })

    const pointer = new THREE.Vector2()
    let angleX = 0, angleY = 0
    window.addEventListener('mousemove', function(event){
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
    })

    //покадровое обновление
    function update(){

        camera.lookAt(cube.position)
        if (Math.abs(pointer.x) >= 0.3){
            angleX += pointer.x / 0.6
            camera.position.x =  2* Math.cos(angleX * Math.PI/180) + cube.position.x
            camera.position.z = 2 * Math.sin(angleX * Math.PI/180) + cube.position.z
        }
        if (Math.abs(pointer.y) >= 0.3){
            angleY -= pointer.y / 0.6
            if (angleY < 0) angleY = 0
            if (angleY > 70) angleY = 70
            camera.position.y = 2 * Math.cos(angleY * Math.PI/180) + cube.position.y
            // camera.position.z = 2 * Math.sin(angleY * 180/Math.PI) + cube.position.z
        }
        // angle = (angle + 0.001)%360
        // camera.position.x = Math.cos(angle * 180/Math.PI) + cube.position.x
        // camera.position.z = 3 * Math.sin(angle * 180/Math.PI) + cube.position.z
        // camera.position.z += 3
        requestAnimationFrame(update)
        rend.render(scene, camera)
        // controls.update()
    }

    update()
}

init()