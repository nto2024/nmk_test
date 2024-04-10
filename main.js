import * as THREE from 'three';

function init(){
    const div = document.getElementById("content")
    const canvas = document.getElementById("main")

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    scene.add(camera)

    const rend = new THREE.WebGLRenderer({canvas});
    rend.setSize(window.innerWidth, window.innerHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace

    window.addEventListener('resize', () => {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        rend.setSize(canvas.offsetWidth, canvas.offsetHeight);
    })

    function update(){
        requestAnimationFrame(update)
        rend.render(scene, camera)
    }

    update()
}

init()