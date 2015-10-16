function Animation() {

    var container, stats;
    var camera, scene, renderer;
    var mesh, animation;

    function init() {

        container = document.getElementById( 'webgl' );

        //

        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 300;
        camera.target = new THREE.Vector3( 0, 150, 0 );

        scene = new THREE.Scene();

        //

        var light;

        light = new THREE.DirectionalLight( 0xefefff, 2 );
        light.position.set( 1, 1, 1 ).normalize();
        scene.add( light );

        light = new THREE.DirectionalLight( 0xffefef, 2 );
        light.position.set( -1, -1, -1 ).normalize();
        scene.add( light );

        var loader = new THREE.JSONLoader();
        loader.load( "models/person.js", function ( geometry, materials ) {

            mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(
                { color: 0x606060, morphTargets: true, overdraw: 0.5 } ) );
            mesh.scale.set( 1.5, 1.5, 1.5 );
            scene.add( mesh );

            animation = new THREE.MorphAnimation( mesh );
            animation.play();

        } );

        //

        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor( 0xf0f0f0 );
        //renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild(renderer.domElement);

        //

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    //

    function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

    }

    var radius = 600;
    var theta = 0;

    var prevTime = Date.now();

    function render() {

        theta += 0.1;

        camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

        camera.lookAt( camera.target );

        if ( animation ) {

            var time = Date.now();

            animation.update( time - prevTime );

            prevTime = time;

        }

        renderer.render( scene, camera );

    }


    return {
        init: init,
        run_user_script: function(moves) {
            animation.play();
        },
        reset_me: function() {

        },
        reset_all: function() {
            // TODO STUB
        },
        stop_user_script: function() {
            // TODO STUB
        }
    };
}

module.exports.Animation = Animation;
