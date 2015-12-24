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
        //loader.load( "models/person.js", function ( geometry, materials ) {
        //
        //    mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(
        //        { color: 0x606060, morphTargets: true, overdraw: 0.5 } ) );
        //    mesh.scale.set( 1.5, 1.5, 1.5 );
        //    scene.add( mesh );
        //
        //    animation = new THREE.MorphAnimation( mesh );
        //    animation.play();
        //
        //} );

        //

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor( 0xf0f0f0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild(renderer.domElement);

        //

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );
        fake();
    }

    function fake() {
        // fake stuff

        function noop() {
        }

        function getObject(geometry, material, transform) {
            return {
                mesh: new THREE.Mesh(geometry, material),
                transform: transform
            };
        }

        window.o3djs = {
            math: {
                matrix4: {
                    translation: function (c) {
                        return new THREE.Matrix4().makeTranslation(c[0], c[1], c[2]);
                    },
                    lookAt: noop
                }
            },
            rendergraph: {
                createBasicView: function (pack, root, render) {
                    scene.add(root);
                    return {
                        clearBuffer: {
                            clearColor: null
                        },
                        drawContext: {
                            view: null
                        }
                    };
                }
            },
            material: {
                createBasicMaterial: function (pack, viewInfo, color) {
                    return new THREE.MeshBasicMaterial({
                        color: new THREE.Color(color[0], color[1], color[2])
                    });
                },
                createAndBindStandardParams: function (pack) {
                    return {
                        lightWorldPos: {
                            value: null
                        },
                        lightColor: {
                            value: null
                        }
                    };
                }
            },
            primitives: {
                createBox: function (pack, material, width, height, depth, transform) {
                    return getObject(new THREE.BoxGeometry(width, height, depth), material, transform);

                },
                createSphere: function (pack, material, radius, widthSegments, heightSegments, transform) {
                    return getObject(new THREE.SphereGeometry(radius, widthSegments, heightSegments), material, transform);
                },
                createCylinder: function (pack, material, radius, height, radiusSegments, heightSegments, transform) {
                    return getObject(new THREE.CylinderGeometry(radius, radius, height, radiusSegments, heightSegments),
                        material, transform);
                }
            },
            event: {
                addEventListener: noop
            }
        };

        initStep2([{
            o3d: null,
            client: {
                createPack: function () {
                    return {
                        createObject: function (typ) {
                            switch (typ) {
                                case 'Transform':
                                    return {
                                        parent: function() {
                                            //setter
                                        },
                                        addShape: function(obj) {

                                        }
                                    };
                                    var m = new THREE.Object3D();
                                    return m;
                            }
                        }
                    }
                },
                renderGraphRoot: null,
                setRenderCallback: function(f) {
                    var exporter = new THREE.OBJExporter();
                    var result = exporter.parse(g_root);
                    //console.log(result);
                    console.log(g_root.toJSON());
                    //floatingDiv.style.display = 'block';
                    //floatingDiv.innerHTML = result.split ('\n').join ('<br />');
                }
            }
        }]);
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
