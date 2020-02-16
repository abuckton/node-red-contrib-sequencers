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

// Toggle Node-RED node file

module.exports = function(RED) {
    "use strict";

    var flipflop = function (flip, flop) {
      var state = false;
      var flip = flip;
      var flop = flop;

      return function() {
        if(state){
          state = false;
          return flop;
        } else {
          state = true;
          return flip;
        }
      };
    };

    function ToggleNode(n) {
        RED.nodes.createNode(this,n);

        this.topic = n.topic;
        this.trigger = n.trigger;
        this.flip = n.flip;
        this.flop = n.flop;

        var state = flipflop(this.flip, this.flop);

        this.on('input', function (msg) {
              if((typeof msg.payload != 'string' ) || (msg.payload == this.trigger)){
              msg.payload = state();
              this.send(msg);
            } else {
              msg.payload = "";
            }

        });
    }

    // Register the node
    RED.nodes.registerType("toggle",ToggleNode);
}
