/* global requirejs cprequire cpdefine chilipeppr transferCode gCoord gCoordNum 
   zoffset gcodeUnit */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-dlvp-widget-touchplate"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load("#testDivForFlashMessageWidget", "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );
    
    chilipeppr.load("#test-serial-port", "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
        function() {
            cprequire(["inline:com-chilipeppr-widget-serialport"],
    
                function(sp) {
                    sp.setSingleSelectMode();
                    sp.init(null, "tinyg");
                    //sp.consoleToggle();
                });
        });
    
    // tinyg widget test load
    chilipeppr.load("#test-tinyg", "http://fiddle.jshell.net/chilipeppr/XxEBZ/show/light/",
        function() {
            cprequire(["inline:com-chilipeppr-widget-tinyg"],
    
                function(tinyg) {
                    tinyg.init();
                });
        });
    
    // axes widget test load
    chilipeppr.load("#test-xyz","http://fiddle.jshell.net/chilipeppr/gh45j/show/light/",
        function() {
            cprequire(["inline:com-chilipeppr-widget-xyz"],
    
                function(xyz) {
                    xyz.init();
                });
        });
    
    // Serial Port Console Log Window
    // http://jsfiddle.net/chilipeppr/JB2X7/
    // NEW VERSION http://jsfiddle.net/chilipeppr/rczajbx0/
    // The new version supports onQueue, onWrite, onComplete

    chilipeppr.load("#test-console", "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",
        function() {
            cprequire(
                ["inline:com-chilipeppr-widget-spconsole"],
    
                function(spc) {
                    // pass in regular expression filter as 2nd parameter
                    // to enable filter button and clean up how much
                    // data is shown
                    spc.init(true, /^{/);
    
                });
        });

    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '10px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-dlvp-widget-touchplate", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-dlvp-widget-touchplate", // Make the id the same as the cpdefine id
        name: "Dlvp Widget / Touchplate", // The descriptive name of your widget.
        desc: "This widget runs in the Machine base unit [mm] and helps you use a touch plate to create your Z zero offset", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            '/jsonSend': 'We send Gcode to the serial port widget to do stuff with the CNC controller.',
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            '/com-chilipeppr-interface-cnccontroller/coords': " Track which is coordinate system is active: G54, G55, etc. The value is {coord:\"g55\", coordNum: 55} or for G92 {coord:\"g92\", coordNum: 92} or for machine {coord:\"g53\", coordNum: 53}",
            '/com-chilipeppr-interface-cnccontroller/units': 'Track which unit mode is active. The value is normalized as {units: \"mm\"} or {units: \"inch\"}',
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();
            this.isInitted = true;
            
            // load audio
            this.audio = new Audio('http://chilipeppr.com/audio/beep.wav');
            
            // issue a resize a bit later
            // issue resize event so other widgets can reflow
            $(window).trigger('resize');

            /**
             * Setup Run Buttons
             * Each tab has buttons to run the various touchplate configurations
             * as defined on each tab
             */
            // Tab 1 - MCS G53 machine coordinate system  - moveable touchplate
            $('#' + this.id + ' .btn-tplaterun1').click(this.onRun.bind(this));
            
            // Tab 2 - WCS G5x work coordinate system - moveable touchplate
            $('#' + this.id + ' .btn-tplaterun2').click(this.onRun.bind(this));
            $('#' + this.id + ' .btn-tplaterun3').click(this.onRun.bind(this));
            
            // Tab 3 - WCS G5x work coordinate system - fixed touchplate
            $('#' + this.id + ' .btn-tplaterun4').click(this.onRun.bind(this));
            $('#' + this.id + ' .btn-tplaterun5').click(this.onRun.bind(this));
            
            // Tab 4 - G30 Goto Position - defines location of fixed touchplate
            $('#' + this.id + ' .btn-tplaterun6').click(this.onG30.bind(this));

            // We want to track which coordinate system is active
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);
            // We want to track which units are active
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/units',this, this.onUnitsUpdate);

            console.log("I am done being initted.");
        },
        
        /**
         * We need to know which coordinate system is active
         * Tabs 2 and 3 will set Z-zero based on the current
         * coordinate system
         */
        lastCoords: {
            coord: null, // G54, G55, etc
            coordNum: null // 54, 55, etc
        },
        
        onCoordsUpdate: function(coords) {
            console.log("On coords update:", coords);
            if (coords.coord != this.lastCoords.coord) {
                $('#' + this.id + ' .tplate-tab2-name').text(coords.coord +" Float");
                $('#' + this.id + ' .tplate-tab3-name').text(coords.coord +" Fixed");
                $('#' + this.id + ' .tplate-notes').text(coords.coord);
                $('#' + this.id + ' .btn-tplaterun2').text(coords.coord + " Run");
                $('#' + this.id + ' .btn-tplaterun4').text(coords.coord + " Run");

                this.lastCoords = coords;
                gCoordNum = coords.coordNum; //54, 55, etc
                gCoord = coords.coord; // G54, G55, etc
            }
        },
        
        /**
         * We need to know which units the G-code is using
         * The G38.2 command will run in the current
         * coordinate system
         */
        currentUnits: null,
        gcodeUnit: null,
        
        onUnitsUpdate: function(units) {
            console.log("onUnitsUpdate. units:",units);
            if (units != this.currentUnits) {
                // Update unit definitions on Widget
                $('.tplate-unit').text(units);
                $('.tplt-dim').text(units);
                $('.tplt-dimv').text(units + "/min");
                
                this.currentUnits = units;
            }
            // Store record of current unit defined in G-code file, unsubscribe
            // upon execution of probe cycle
            if (this.currentUnits == "mm") {
                gcodeUnit = "G21 (mm)";
            } else {
                gcodeUnit = "G20 (inch)";
            }
        },
        
        
        /**
         * Call this method on button click to begin running the touch plate
         * code and set the Z-zero value.
         */
        gcodeCtr: 0,
        isRunning: false,
        transferCode: null,
        runCode: null,
        
        onRun: function(evt) {
            // when user clicks the run button
            console.log("user clicked run button. evt:", evt, event.target.id);
            
            // Stop tracking coordinates
            chilipeppr.unsubscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);
            // Stop tracking units
            chilipeppr.unsubscribe('/com-chilipeppr-interface-cnccontroller/units',this, this.onUnitsUpdate);
            
            // define variable to determine which subroutine to run based on
            // user selection through the tabs
            var runCode = event.target.id;
            // logs which button was clicked
            console.log("this is the runCode:", runCode);
            
            // transfer runCode to read only global variable
            transferCode = runCode;
            
            // Stop controller upon completion of probing cycle
            console.log("The transferCode is:", transferCode);
            
            if (this.isRunning) {

                // Stop controller
                var id = "tp" + this.gcodeCtr++;
                var gcode = "!\n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});

                
                // Swap clicked button to run
                if (runCode == "run1") {
                    // Run WCS (G53) button
                    $('#' + this.id + ' .btn-tplaterun1').removeClass("btn-danger").text("Run WCS");
                    this.isRunning = false;
                
                } else if (runCode == "run2" || runCode == "run4") {
                    // Run G5x (MCS) button
                    $('#' + this.id + ' .btn-tplate' + runCode).removeClass("btn-danger").text(gCoord + " Run");
                    this.isRunning = false;
                    
                } else {
                    // Run G92 (MCS) button
                    $('#' + this.id + ' .btn-tplate' + runCode).removeClass("btn-danger").text("G92 Run");
                    this.isRunning = false;
                }

            } else {
                
                // Start probing process
                
                this.isRunning = true;
                // Start controller and swap button to stop
                $('#' + this.id + ' .btn-tplate' + runCode).addClass("btn-danger").text("Stop");
                
                // Get user feedrate from input group
                var fr = $('#com-chilipeppr-dlvp-widget-touchplate.frprobe').val();
                var zclr = $('#' + this.id + ' .zclear').val();
                
                console.log("run code is:", runCode);
                
                // Start watch for circuit closing, subscribe to recvline
                this.watchForProbeStart();
               
                // G30 Probe cycle runs an additional routine to move the head
                // to the fixed probe position befor running the probe cycle
                /**
                 * Note: testing has shown that the g91 throughs a bug into the coordinates
                 * it will add the current mpo position to the G30.1 saved coordinates
                 * and present them back to WCS coordinates.  Break the Z move into a
                 * separate step
                 */
                if (runCode == "run4" || runCode == "run5") {
                    console.log("runcode 4 was triggered", runCode);
                    // Raise head to clearance height
                    var id = "tp" + this.gcodeCtr++;
                    var gcode = "G91 G0 Z" + zclr + "\n";
                    chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                    // Move to G30 position
                    var id = "tp" + this.gcodeCtr++;
                    var gcode = "G90 G21 G30 \n";
                    chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                    
                    // Check to see if initial units were inch
                    if (gcodeUnit == "G20 (inch)") {
                        var id = "tp" + this.gcodeCtr++;
                        var gcode = "G20 \n";
                        chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                    }
                }
                
                // Run G38.2 Probe Cycle for all buttons
                var id = "tp" + this.gcodeCtr++;
                var gcode = "G38.2 Z-100  F" + fr + "\n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
        },
        
        /**
         * Call this method when the G30 define button is clicked on tab 4.
         * The G30 Tab 4 will create a defined position, through a G30.1 command 
         * that locates a fixed touchplate. 
         * 
         * Note: G30 command is not persistent.
         * 
         * Sending the G30.1 - This will "remember" the absolute position. This 
         * position remains constant regardless of what coordinate system is 
         * in effect.
         */
        gcodeCtr: 0,
        isRunning: false,
        runCode: null,
        
        onG30: function(evt) {
            // when user clicks the G30 button
            console.log("user clicked run button. evt:", evt, event.target.id);
            chilipeppr.unsubscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);
            chilipeppr.unsubscribe('/com-chilipeppr-interface-cnccontroller/units',this, this.onUnitsUpdate);

            // define variable to determine which subroutine to run based on
            // user selection through the tabs
            var runCode = event.target.id;
            // logs which button was clicked
            console.log("this is the runCode:", runCode);
            
            if (this.isRunning) {
                
                // Stop controller
                var id = "tp" + this.gcodeCtr++;
                var gcode = "!\n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                
                // Swap selected button to run
                    $('#' + this.id + ' .btn-tplaterun6').removeClass("btn-danger").text("G30 Fixed Location");
                    this.isRunning = false;
            } else {
                
                // Start process
                this.isRunning = true;
                
                // Swap selected button to stop
                $('#' + this.id + ' .btn-tplaterun6').addClass("btn-danger").text("Stop");
                
                // Send command to set the G30 location
                var id = "tp" + this.gcodeCtr++;
                var gcode = "G90 G21 G30.1 \n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                
                if (gcodeUnit == "G20 (inch)") {
                    var id = "tp" + this.gcodeCtr++;
                    var gcode = "G20 \n";
                    chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                }
                // Swap selected button to run
                    $('#' + this.id + ' .btn-tplaterun6').removeClass("btn-danger").text("G30 Fixed Location");
                    this.isRunning = false;
            }
        },

        /**
         * Subscribes to the recvline to analyze data being received
         */
        watchForProbeStart: function() {
            chilipeppr.subscribe("/com-chilipeppr-widget-serialport/recvline", this, this.onRecvLineForProbe);
        },
        
        /**
         * Watch for signal that touchplate circuit is closed
         */
        watchForProbeEnd: function() {
            chilipeppr.unsubscribe("/com-chilipeppr-widget-serialport/recvline", this, this.onRecvLineForProbe);
        },
        
        /**
         * Opens the recvline to the controller to receive data
         */
        onRecvLineForProbe: function(data) {
            console.log("onRecvLineForProbe. data:", data);
            
            if (!('dataline' in data)) {
                console.log("did not get dataline in data. returning.");
				return;
            }

            // inspect data to ensure it is in the correct format
            // ex. {"prb":{"e":1,"z":-7.844}}
            var json = $.parseJSON(data.dataline);
            
            // detect and remap if needed
            if ('r' in json && 'prb' in json.r) json = json.r;
            
            // confirm the data is for probe ending
		    if ('prb' in json && 'e' in json.prb && 'z' in json.prb) {
		        // yes, it's data for the probe ending
		    
		        // now do all the final steps now that we got our data
		        this.afterProbeDone(json.prb);
		    }
        },
        
        /**
         * Close recvline to the controller and complete probe cycle
         * Depending on which button was clicked, the function will
         * set the the Z-zero for the appropriate coordinate system
         */
        zoffet: 0,
        afterProbeDone: function(probeData) {
            // probeData should be of the format
            // {"e":1,"z":-7.844}
            console.log("afterProbeDone. probeData:", probeData);
            
            // unsub so we stop getting events
            this.watchForProbeEnd();
            
            // play good beep
            this.audio.play();
            
            // Stop controller upon completion of probing cycle
            // Cycle stop and swap buttons to run
            this.isRunning = false;
            
            // Define Height of Plate (plth) for inclusion into setting Z-zero
            var plth = $('#' + this.id + ' .htplate').val();
            if (isNaN(plth)) plth = 0;
                console.log("heightPlate:", plth);

            console.log("probeData.z:", probeData.z);
            // Define zoffset for use in the next function
            // probeData.z is in mm, need to check if plth is inch or mm
            var zoffset = probeData.z - plth;

            if (transferCode == "run1") {
                // Run WCS (G53) button - Tab 1
                $('#' + this.id + ' .btn-tplaterun1').removeClass("btn-danger").text("Run WCS");
                
                // Set G53 machine coordinates Z-value to zero
                // create Gcode and send to controller
                var gcode = "G28.3 Z" + plth + "\n";
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
            
            else if (transferCode == "run2" || "run4") {
                // Run G5x (MCS) button for floating touchplate - Tab 2 or 3
                $('#' + this.id + ' .btn-tplate' + transferCode).removeClass("btn-danger").text(gCoord + " Run");
                
                // Get coordNum for inclusion in G10 L2 Pn
                //var prbCoordNum = gCoordNum;
                var prbCoordNum = Number(this.lastCoords.coordNum);
                
                // create Gcode and send to controller
                var gcode = "G10 L2 P" + (prbCoordNum - 53) + " Z" + zoffset + "\n";
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
            
            else {
                // Run G92 (MCS) button for fixed touchplate - Tab 2 or 3
                $('#' + this.id + ' .btn-tplate' + transferCode).removeClass("btn-danger").text("G92 Run");
                
                 // Set the G5x offset via temporary offset G92
                var gcode = "G92 Z" + plth + "\n";
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
            
             // Back tool off of touch plate (2mm)
             // Need to check units, inch or mm
            var gcode = "G91 G0 Z2\n";
    		var id = "tp" + this.gcodeCtr++;
	    	chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
	    	
	    	// return to absolute coordinate system
    		var gcode = "G90\n";
	    	var id = "tp" + this.gcodeCtr++;
		    chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            
            // Turn on subscription to track  Coordinate System is active
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);
            // Turn on subscription to track which units are active
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/units',this, this.onUnitsUpdate);
        },
        
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });
        },

        isHidden: false,
        
        unactivateWidget: function() {
            if (!this.isHidden) {
                // unsubscribe from everything
                console.log("unactivateWidget. unsubscribing.");
                this.isHidden = true;
        
            }
            // issue resize event so other widgets can reflow
            $(window).trigger('resize');
        },

        activateWidget: function() {
            if (!this.isInitted) {
                this.init();
            }
            if (this.isHidden) {
                // resubscribe
                console.log("activateWidget. resubscribing.");
                this.isHidden = false;
            }
            // issue resize event so other widgets can reflow
            $(window).trigger('resize');
        },

        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            var options = localStorage.getItem('com-chilipeppr-dlvp-widget-touchplate -options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 2,
                    frprobe: 25,
                    htplate: 1.75,
                    zclear: 10
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }
            
            //setup textboxes
            $('#com-chilipeppr-dlvp-widget-touchplate.frprobe').val(this.options.frprobe);
            $('#' + this.id + '.htplate').val(this.options.htplate);
            $('#' + this.id + '.zclear').val(this.options.zclear);
            
            // on change attach new values
            $('#' + this.id + ' input').change(this.saveOptionsLocalStorage.bind(this));
            console.log("options:", options);
        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            
            // retrieve input vals
            this.options.frprobe = $('#com-chilipeppr-dlvp-widget-touchplate.frprobe').val();
            this.options.htplate = $('#' + this.id + '.htplate').val();
            this.options.zclear =  $('#' + this.id + '.zclear').val();

            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem('com-chilipeppr-dlvp-widget-touchplate-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    };
});