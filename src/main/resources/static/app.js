var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null,
        topic;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.' + topic, function (eventbody) {
                var content = JSON.parse(eventbody.body);
                //alert("x: " + content.x + " y: "+ content.y);
                addPointToCanvas(new Point(content.x,content.y))
            });
        });

    };


    var eventHandler = function(evt) {
        let coordinates = getMousePosition(evt);
        app.publishPoint(coordinates.x, coordinates.y);
    }
    
    

    return {

        init: function () {
            var canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", eventHandler);
            } else {
                canvas.addEventListener("mousedown", eventHandler);
            }
            //websocket connection
            //connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            //publicar el evento
            stompClient.send("/app/newpoint." + topic, {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },

        subscribeToTopic : function(newTopic){
            topic = newTopic;
            connectAndSubscribe();
        }
    };

})();