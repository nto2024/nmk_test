import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

function init(){
    //инициализация объектов, где проходит рендер
    const div = document.getElementById("content")
    const canvas = document.getElementById("main")

    //инициализация сцены и камеры
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, div.offsetWidth / div.offsetHeight, 0.1, 1000)
    camera.position.y = 3;
    camera.position.z = 3
    scene.add(camera)

    const raycaster = new THREE.Raycaster();

    //создание болванки пола
    const planeG = new THREE.PlaneGeometry(3, 10)
    const matP = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
    const floor = new THREE.Mesh(planeG, matP)
    floor.receiveShadow = true
    floor.rotation.x = -0.5 * Math.PI
    floor.position.z = -3.5
    scene.add(floor)

    //добавление света
    const alight = new THREE.AmbientLight(0xFFFFFF, 1.5)
    scene.add(alight)

    const light1 = new THREE.PointLight(0xd6fffb, 5)
    light1.position.x = -1
    light1.position.y = 3
    light1.position.z = -1.5
    light1.castShadow = true
    scene.add(light1)

    const light2 = new THREE.PointLight(0xd6fffb, 5)
    light2.position.x = 1
    light2.position.y = 3
    light2.position.z = 0
    light2.castShadow = true
    scene.add(light2)

    const light3 = new THREE.PointLight(0xd6fffb, 5)
    light2.position.x = 1
    light2.position.y = 3
    light2.position.z = -3
    light2.castShadow = true
    scene.add(light3)

    //подгрузка моделей
    const loader = new GLTFLoader()

    let char
    loader.load(
        '/assets/char/main.glb',
        function (gltf){
            char = gltf.scene
            char.rotation.y = Math.PI
            scene.add(char)
            char.traverse(function(n) {
                if(n.isMesh){
                    n.castShadow = true
                }
            })
        }
    )
    let hat
    loader.load(
        '/assets/hat/hat.glb',
        function (gltf){
            hat = gltf.scene
            hat.position.z = -7
            hat.position.y = -0.5
            scene.add(hat)
            hat.traverse(function(n) {
                if(n.isMesh){
                    n.castShadow = true
                }
            })
        }
    )

    loader.load(
        '/assets/ux_1/main.glb',
        function (gltf){
            const obj = gltf.scene
            obj.position.z = -7
            scene.add(obj)
            obj.traverse(function(n) {
                if(n.isMesh){
                    n.castShadow = true
                }
            })
        }
    )

    loader.load(
        '/assets/ux_2/main.glb',
        function (gltf){
            const obj = gltf.scene
            obj.position.x = 1.2
            obj.position.z = -1.3
            obj.position.y = 0.1
            obj.rotation.y = Math.PI
            scene.add(obj)
            obj.traverse(function(n) {
                if(n.isMesh){
                    n.castShadow = true
                }
            })
        }
    )

    loader.load(
        '/assets/ux_3/main.glb',
        function (gltf){
            const obj = gltf.scene
            obj.position.x = -1.8
            obj.position.z = -2.5
            obj.position.y = 0.4
            obj.rotation.y = 1.5 *  Math.PI
            scene.add(obj)
            obj.traverse(function(n) {
                if(n.isMesh){
                    n.castShadow = true
                }
            })
        }
    )

    //рендер для сцены
    const rend = new THREE.WebGLRenderer({canvas});
    rend.setSize(div.offsetWidth, div.offsetHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace
    rend.shadowMap.enabled = true


    //изменения если изменился размер окна
    window.addEventListener('resize', () => {
        camera.aspect = div.offsetWidth / div.offsetHeight;
        camera.updateProjectionMatrix();
        rend.setSize(div.offsetWidth, div.offsetHeight);
    })

    window.addEventListener('keydown', function(event){
        if (event.code === 'KeyW'){
            char.position.z -= 0.05
            camera.position.z -= 0.05
            char.rotation.y = -Math.PI
        }
        if (event.code === 'KeyS'){
            char.position.z += 0.05
            camera.position.z += 0.05
            char.rotation.y = Math.PI
        }
    })

    //вращение камеры
    const pointer = new THREE.Vector2()
    let angleX = 0, angleY = 0
    window.addEventListener('mousemove', function(event){
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
    })

    //надевание шляпы
    let ishatOn = false
    window.addEventListener('click', function(ev){
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {w
            if (intersects[i].object.name === "hat_l"){
                ishatOn = true
            }
        }
    })

    //покадровое обновление
    function update(){
        //вращение камеры
        try{
            camera.lookAt(char.position);
            if (Math.abs(pointer.x) >= 0.3){
                angleX += pointer.x / 0.6
                camera.position.x =  3* Math.cos(angleX * Math.PI/180) + char.position.x
                camera.position.z = 3 * Math.sin(angleX * Math.PI/180) + char.position.z
            }
            if (Math.abs(pointer.y) >= 0.3){
                angleY -= pointer.y / 0.6
                if (angleY < 0) angleY = 0
                if (angleY > 70) angleY = 70
                camera.position.y = 2 * Math.cos(angleY * Math.PI/180) + char.position.y
                
            }
        }
        catch (e){
            console.log()
        }
        //проверка надета ли шляпа
        if (ishatOn){
            hat.position.x = char.position.x
            hat.position.y = char.position.y - 0.06
            hat.position.z = char.position.z + 0.03
        }
        requestAnimationFrame(update)
        rend.render(scene, camera)
    }

    update()
}

init()