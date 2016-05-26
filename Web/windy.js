var client;
var led;

// Connected to broker
// Subscribe for count topic
function doClientConnect( context ) {
    console.log( 'Connected.' );
	client.subscribe( 'iot-2/type/Tessel/id/IBM/evt/light/fmt/json' );
	client.subscribe( 'iot-2/type/Tessel/id/IBM/evt/button/fmt/json' );	
}    
    
// Unable to connect
function doClientFailure( context, code, message ) {
    console.log( 'Connection fail.' );
}    

// Message arrived
function doMessageArrived( message ) {
	var data = null;

	// Parse
	data = JSON.parse( message.payloadString );

	// Subscribed to multiple topics
	// Look for event name and direct accordingly
	if( message.destinationName.indexOf( 'button' ) >= 0 ) {		
		console.log( 'Button: ' + data.pressed );
	} else if( message.destinationName.indexOf( 'light' ) >= 0 ) {
		console.log( 'Light: ' + data.light );
	}
}	

// Button to toggle LED clicked
// Send event to device
function doToggleClick() {
	var message = null;
	
	// Toggle LED state
	led = led === 0 ? 1 : 0;
	
	// Build message
	message = new Paho.MQTT.Message( JSON.stringify( {
		led: led
	} ) );
	message.destinationName = 'iot-2/type/Tessel/id/IBM/cmd/led/fmt/json';
	
	// Send
	client.send( message );	
}

function doWindowLoad() {
	var button = null;
	
	// Initialize LED state
	// Off
	led = 0;
	
	// Let the user change the LED state
	button = document.querySelector( 'button' );
	button.addEventListener( 'click', doToggleClick );
	
	// Instantiate client
    try {
        client = new Paho.MQTT.Client(
            IOT_HOST, 
            IOT_PORT, 
            IOT_CLIENT + Math.round( Math.random() * 1000 )
        );
		client.onMessageArrived = doMessageArrived;
    } catch( error ) {
        console.log( 'Error: ' + error );
    }    
    
	// Connect to broker
    client.connect( {
        userName: IOT_USER,
        password: IOT_PASSWORD,
        onSuccess: doClientConnect,
        onFailure: doClientFailure
    } );	
}

window.addEventListener( 'load', doWindowLoad );