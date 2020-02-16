/**
 
Copyright 2017 Anthony Buckton, Black Ink Networks Pty Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**/
module.exports = function(RED) {
    "use strict";

    function TimedSequenceNode(n) {
        RED.nodes.createNode(this, n);
        this.start = n.start;
        this.stop = n.stop;
        this.events = n.events;
        var active = false;
        var node = this;

        for (var i=0; i<this.events.length; i+=1) {
            var _event = this.events[i];
            if (isNaN(Number(_event.delay))) {
                node.warn("event "+i+" delay value is not a number:"+_event.delay)
                _event.delay = Number(0);
            }
        }


        function sendEventMessageCallback(n, msg, inx){
          try {
            if(!active){
              return;
            }

            // Send the current message
            msg.payload = n.events[inx].mesg;
            n.send(msg);

            //Queue up the next message
            inx += 1;
            if(inx < (n.events.length)){
              setTimeout(function(){ sendEventMessageCallback(n, msg, inx) }, n.events[inx].delay);
            } else {
              active = false;
            }

          } catch (err) {
            node.warn(err);
          }
        }


        this.on('input', function (msg) {
            if(msg.payload == this.start && !active && this.events.length>0){
              active=true;
              setTimeout(function() { sendEventMessageCallback(node, msg, 0)}, this.events[0].delay);
            }
            else if(msg.payload == this.stop){
              active=false;
            }
        });

    }
    RED.nodes.registerType("TimedSeq", TimedSequenceNode);
}
