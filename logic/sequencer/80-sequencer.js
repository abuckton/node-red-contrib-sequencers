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

    function SequencerNode(n) {
        RED.nodes.createNode(this, n);

        this.trigger = n.trigger;
        this.expiry = n.expiry;
        this.events = n.events;
        this.expired_event = n.expired_event;

        var expired = false;
        var seq_index = 0;
        var timer = 0;
        var node = this;

        if (isNaN(Number(node.timeout))) {
            node.timeout = Number(0);
        }

        this.on('input', function (msg) {
            if(node.trigger == "" || node.trigger == msg.payload){

              if(seq_index > 0 && expired==true){
                seq_index=0;
                expired=false;
                if(node.expired_event != ""){
                  msg.payload =node.expired_event;
                  node.send(msg);
                  return;
                }
              }

              if(node.expiry!= 0){
                if(timer != 0){
                  clearTimeout(timer);
                }
                timer = setTimeout(function(){
                  expired=true;
                }, node.expiry);
              }

              msg.payload = node.events[seq_index].mesg;
              node.send(msg);

              if(seq_index == (node.events.length-1)){
                seq_index=0;
              } else {
                seq_index+=1;
              }

            }
        });

    }
    RED.nodes.registerType("Sequencer", SequencerNode);
}
