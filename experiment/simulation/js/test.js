
let depthLabelInput = document.getElementById("depth-label");
disableButton();

document.getElementById('depth-button');
  let nodeArray = [];
  let edgeArray = [];
  let nodes= new vis.DataSet(nodeArray);
  let edges = new vis.DataSet(edgeArray);
   
    
    //values
    let values=[[],[]];
    let tableArray=[];
    //count
    
    
    var container = document.getElementById('mynetwork');
    var data = { nodes: nodes, edges: edges };
    var options = { };
    var network = new vis.Network(container, data, options);

 //call grapOtion in vis.network
    var network = new vis.Network(container, data, options);
   
 network.setOptions(grapOptions);
    //create node based on depth value
    function addGraph() {
      
      //if submit button is clicked,prompt to enter the terminal node value
      
      
      
      
       
      
     
      let depth = document.getElementById('depth-label').value;
      //depth value between 3-10
      if(depth<3 || depth>10){
        alert("Please enter a value between 3-10");
        return;
      }
         
      var count=2**depth-1;
    
      var i;
      for (i = 1; i <= count; i++) {
        //id
        id = i;
    
        //node label
        label = "Node "+id ;
        //leftchild
        if(i*2<=count){
          leftchild=i*2;
        }
        else{
          leftchild=null;
        }
        //rightchild
        if(i*2+1<=count){
          rightchild=i*2+1;
        }
        else{
          rightchild=null;
        }
    
        //add node to the node array
        nodes.add({id: id, label: label,leftchild:leftchild,rightchild:rightchild});
        nodeArray.push({id: id, label: label,leftchild:leftchild,rightchild:rightchild});
    
        //increment id
        id++;
     
        //edge connection based on binary tree
        if(i*2<=count){
          edges.add({from: i, to: i*2,label:"",leftchild:leftchild,rightchild:rightchild});
          edgeArray.push({from: i, to: i*2,label:"",leftchild:leftchild,rightchild:rightchild});
        }
        if(i*2+1<=count){
          edges.add({from: i, to: i*2+1,label:"",leftchild:leftchild,rightchild:rightchild});
          edgeArray.push({from: i, to: i*2+1,label:"",leftchild:leftchild,rightchild:rightchild});
        }
      }
    
      console.log(nodeArray);
      console.log(edgeArray);
    
      
    
      //update node values based on the minmax value
      for(let i=0;i<nodeArray.length;i++){
        if(nodeArray[i].flag==1){
          updateLabel(nodeArray[i].id, nodeArray[i].minmaxValue, nodeArray[i].leftchild, nodeArray[i].rightchild);
        }
      }
      // if(onclick = document.getElementById('submit')){
      //   alert("Enter the terminal node value to enable the submit button");
      // }
      
    };
    //alert box to enter the terminal node value
    //after graph is created, prompt to enter the terminal node value
    



    


    
  
    //if terminal node is clicked, prompt to enter the value,only number is allowed
    network.on("click", function (params) {
      params.event = "[original event]";
      if (params.nodes.length == 1) {
        if (params.nodes[0] <= 2 ** document.getElementById('depth-label').value - 1) {
          let value = prompt("Enter the value");
          if (value != null) {
            if (isNaN(value)) {
              alert("Please enter a number");

            }
            
            
            else {
              updateLabel(params.nodes[0], value, nodeArray[params.nodes[0] - 1].leftchild, nodeArray[params.nodes[0] - 1].rightchild);
              values.push([params.nodes[0], value]);
              console.log(values);
              enableButton();
            }
          }
        }
      }
    });

    
      

       //function to update label
    function updateLabel(id, label, leftchild, rightchild) {
      //update label
      nodes.update({ id: id, label: label, leftchild: leftchild, rightchild: rightchild });
      //update node array
      nodeArray[id - 1].label = label;
      nodeArray[id - 1].leftchild = leftchild;
      nodeArray[id - 1].rightchild = rightchild;
      //update edge array
      // edgeArray[id * 2 - 1].to = leftchild;
      // edgeArray[id * 2].to = rightchild;
      //update graph
      nodes.update(nodeArray);
      edges.update(edgeArray);
    }
     //function to update label
     function updateLabel1(id, label, leftchild, rightchild) {
      //update label
     
      nodes.update({ id: id, label: label, leftchild: leftchild, rightchild: rightchild });
      
      //update node array
      //edge label
      edgeArray[id * 2 - 1].label = label;
      edgeArray[id * 2].label = label;

      //update graph
      nodeArray[id - 1].leftchild = leftchild;
      nodeArray[id - 1].rightchild = rightchild;
      //update edge array
      // edgeArray[id * 2 - 1].to = leftchild;
      // edgeArray[id * 2].to = rightchild;
      //update graph
      nodes.update(nodeArray);
      edges.update(edgeArray);
    }
    //function to update edge label
    function updateEdgeLabel(id, label, leftchild, rightchild) {
      edges.update({ id: id, label: label, leftchild: leftchild, rightchild: rightchild });
      //update edge array
      if(id-2>=0)
      {
      edgeArray[id-2].label = label;
      edgeArray[id - 2].leftchild = leftchild;
      edgeArray[id - 2].rightchild = rightchild;
      //edge label color
      edgeArray[id - 2].color = "red";
      //edge label font
      edgeArray[id - 2].font = { color: "black" };
      //edge label size
      edgeArray[id - 2].font.size = 20;
      //update graph
      edges.update(edgeArray);
      console.log(edgeArray);
    }
    }
    
      
    //if the terminal value is entered the submit button is enabled
    function enableButton(){
     
        document.getElementById("submit").disabled = false;
      
    }
    //if the terminal value is not entered the submit button is disabled
    function disableButton(){
      document.getElementById("submit").disabled = true;
    }
    

      


   
   //copy the value of values to nodeArray
    function copyValue(){
     
      for(let i=0;i<values.length;i++){
        nodeArray[i].nodeValue=values[i][1];

      }

      console.log(nodeArray);
      pushValue();
    }  

    //push the value of nodeArray to tableArray
    function pushValue(){
      for(let i=0;i<nodeArray.length;i++){
        tableArray.push([nodeArray[i].id,nodeArray[i].label,nodeArray[i].leftchild,nodeArray[i].rightchild,nodeArray[i].nodeValue]);
      }
      console.log(tableArray);
    }

    //minmax algorith traverse the tree and find minimum and maximum value
    function minmax( ) {
      //set alpha to -1000
      let alpha = -2000;
      //set beta to 1000
      let beta = 2000;
      //set ismax to true
      let isMax = true;
      


      //get depth
      let depth = document.getElementById('depth-label').value;
      //get count
      let count = 2 ** depth - 1;
      //for each node
      for (let i = count; i > 0; i--) {
        
        //convert nodevalue to integer
        nodeArray[i - 1].nodeValue = parseInt(nodeArray[i - 1].nodeValue);
        //update nodevalue


      depth = Math.floor(Math.log2(i));

        //if node is a leaf node
        if (nodeArray[i - 1].leftchild == null && nodeArray[i - 1].rightchild == null) {
          //update node value
          nodeArray[i - 1].nodeValue = nodeArray[i - 1].label;
          //update edge label
          updateEdgeLabel(i, nodeArray[i - 1].nodeValue, nodeArray[i - 1].leftchild, nodeArray[i - 1].rightchild);
          //update node label
          updateLabel(i, nodeArray[i - 1].nodeValue, nodeArray[i - 1].leftchild, nodeArray[i - 1].rightchild);
          nodes.update({ id: i, label: nodeArray[i - 1].nodeValue, font: { color: '#000001', size: 25 } });
        }
        
       
        //if node is not a leaf node
        else {
          //check depth is odd ismax is true
          if (depth % 2 == 1) {
            isMax = false;
          }
          //check depth is even ismax is false
          else {
            isMax = true;
          }
          
          //ismax is true change node shapes to square
          if (isMax) {
            
            nodeArray[i - 1].shape = 'dot';
           

            //update node shape
            nodes.update({ id: i ,size :20,  font : {color : "black" ,size : 20}, });
          }
          //ismax is false change node shapes to circle
          else {
            
            nodeArray[i - 1].shape = 'square';
            // nodes.update({ id: i, shape: 'circle' });
            //update node shape
            nodes.update({ id: i,size:20,  font : {color : 'black',size:20}, });
          }

          //if node is a max node
          if (isMax) {
                     

            //set alpha to -1000
            alpha = -2000;
            //if left child is not null
            if (nodeArray[i - 1].leftchild != null) {
              //convert left child value to integer
              nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue);
              //if left child value is greater than alpha
              if (nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue >= alpha) {
                //set alpha to left child value
                alpha = nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue;
              }
              

            }
            //if right child is not null
            if (nodeArray[i - 1].rightchild != null) {
              //convert right child value to integer
              nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue);

              //if right child value is greater than alpha
              if (nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue >= alpha) {
                //set alpha to right child value
                alpha = nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue;
              }
              
              //showoperation
              //showOperations(msg);

            }
            //update node value

            nodeArray[i - 1].nodeValue = alpha;
            //covert node value to string
            nodeArray[i - 1].nodeValue = nodeArray[i - 1].nodeValue.toString();
            //upadte edge label
           updateEdgeLabel(i, nodeArray[i - 1].nodeValue, nodeArray[i - 1].leftchild, nodeArray[i - 1].rightchild);

            //update node label
          //updateLabel1(i, nodeArray[i - 1].nodeValue, nodeArray[i - 1].leftchild, nodeArray[i - 1].rightchild);
            if(nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue==alpha){
              var msg="Node "+i+"= max("+nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue +" , "+ nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue + ") = <span class ='light' >" + alpha;
              //showoperation
              showOperations(msg);
            }
            else{
              var msg="Node "+i+"= max("+nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue +" , "+ nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue + ") = <span class ='light' >" + alpha;
              //showoperation
              showOperations(msg);
                       

          }
        }
          //if node is a min node
          else {
            //set beta to +infinity
            beta = 2000;
            
            //if left child is not null
            if (nodeArray[i - 1].leftchild != null) 
            {
              //convert left child value to integer
              nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue);
              //if left child value is less than beta
              if (nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue <= beta) {

                //set beta to left child value
                beta = nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue;
              }
            //  var msg="rightchild = min("+nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue +" , "+nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue + ") = " + beta;
            //   //showoperation
            //   showOperations(msg);

            }
            //if right child is not null
            if (nodeArray[i - 1].rightchild != null) {
              //convert right child value to integer
              nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue);
              //if right child value is less than beta
              if (nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue <= beta) {
                //set beta to right child value
                beta = nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue;
              }
             

            }
            //update node value
            nodeArray[i - 1].nodeValue = beta;
            //covert node value to string
            nodeArray[i - 1].nodeValue = nodeArray[i - 1].nodeValue.toString();
            //upadate edge label
            updateEdgeLabel(i, nodeArray[i - 1].nodeValue, nodeArray[i - 1].leftchild, nodeArray[i - 1].rightchild);
            //update node label
           //updateLabel1(i, nodeArray[i - 1].nodeValue, nodeArray[i - 1].leftchild, nodeArray[i - 1].rightchild);
           //if leftchild is min
            if(nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue==beta){
              var msg="Node "+i+"= min("+nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue +" , "+ nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue + ") = <span class ='light' >" +  beta;
              //showoperation
              showOperations(msg);
            }
            //if rightchild is min
            if(nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue==beta){
              var msg="Node "+i+" = min("+nodeArray[nodeArray[i - 1].leftchild - 1].nodeValue +" , "+ nodeArray[nodeArray[i - 1].rightchild - 1].nodeValue + ") = <span class ='light' >" +  beta;
              //showoperation
              showOperations(msg);
            }


          }
        }
       
      }
      var msg="<span class ='light' >The optimal value is  "+nodeArray[0].nodeValue;
      //showoperation
      showOperations(msg);

     
      //display result path
      displayNodeValue();
      highlightResult();
      displayInfo();
    }
//update edge label
    



   info1=0;
    function displayInfo(){  
       //only run one time
  if(info1==0){
    info1=1;
    //display info
   // document.getElementById("left").innerHTML+="Square - Minimizer"+"<br>"+ "circle -Maximizer"+"<br>";
  }
}
   
    //display node value
    function displayNodeValue() {
      //get table
      let table = document.getElementById('table');
      //clear table
      table.innerHTML = "";

     //create table header
let header = "<tr><th>Node Label</th><th>Node Value</th></tr>";

//initialize cells
let cells = "";

//for each node
for (let i = 0; i < nodeArray.length; i++) {
  //add node label and value to cells
cells += "<tr><td>" + "Node "+nodeArray[i].id + "</td><td>" + nodeArray[i].nodeValue + "</td></tr>";
}

//add table to html
table.innerHTML = header + cells;

    }
  //highlight result path in graph
  function highlightResult() {
    if(nodeArray[0].nodeValue==nodeArray[0].nodeValue){
      //highlight root
      nodes.update({ id: 1, color:'yellow' });
      //highlight edge
      edges.update({ from: 1, color: 'yellow'});
    }
    
    //for each node

    for (let i = 0; i < nodeArray.length; i++) {
     
      //if node is a max node
      if (nodeArray[i].type == "max") {
        //if left child is not null
        if (nodeArray[i].leftchild != null) {
          //convert left child value to integer
          nodeArray[nodeArray[i].leftchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i].leftchild - 1].nodeValue);
          //if left child value is equal to node value
          if (nodeArray[nodeArray[i].leftchild - 1].nodeValue == nodeArray[i].nodeValue) {
            //highlight edge
            edges.update({ from: nodeArray[i].id, to: nodeArray[i].leftchild, color: 'red'});
            //highlight node
            nodes.update({ id: nodeArray[i].leftchild.value, color: 'red' });
          }
        }
        //if right child is not null
        if (nodeArray[i].rightchild != null) {
          //convert right child value to integer
          nodeArray[nodeArray[i].rightchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i].rightchild - 1].nodeValue);
          //if right child value is equal to node value
          if (nodeArray[nodeArray[i].rightchild - 1].nodeValue == nodeArray[i].nodeValue) {
            //highlight edge
            edges.update({ from: nodeArray[i].id, to: nodeArray[i].rightchild, color: 'red' });
            //highlight node
            nodes.update({ id: nodeArray[i].rightchild, color: 'red' });
          }
        }
      }
      //if node is a min node
      else {
        //if left child is not null
        if (nodeArray[i].leftchild != null) {
          //convert left child value to integer
          nodeArray[nodeArray[i].leftchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i].leftchild - 1].nodeValue);
          //if left child value is equal to node value
          if (nodeArray[nodeArray[i].leftchild - 1].nodeValue == nodeArray[i].nodeValue) {
            //highlight edges using animation-delay: 5s;
            edges.update({ from: nodeArray[i].id, to: nodeArray[i].leftchild, color: 'yellow'});
            //highlight node
            nodes.update({ id: nodeArray[i].leftchild, color: 'yellow' });
          }
        }
        //if right child is not null
        if (nodeArray[i].rightchild != null) {
          //convert right child value to integer
          nodeArray[nodeArray[i].rightchild - 1].nodeValue = parseInt(nodeArray[nodeArray[i].rightchild - 1].nodeValue);
          //if right child value is equal to node value
          if (nodeArray[nodeArray[i].rightchild - 1].nodeValue == nodeArray[i].nodeValue) {
            //highlight edge
            edges.update({from: nodeArray[i].id, to: nodeArray[i].rightchild, color: 'yellow' });
            //highlight node
            nodes.update({ id: nodeArray[i].rightchild, color: 'yellow' });
          }
        }
      }
    }
     }
    //function to show operations of minmax()
    function showOperations(message) {

      //get operations div
      let operations = document.getElementById('operations');
      //add message to operations div
      operations.innerHTML += message + "<br>";
      //append
      operations.scrollTop = operations.scrollHeight;
      operations.appendChild(document.createElement('br'));

    }

    //function to reset graph
    function reset() {
      location.reload();
    }
  //if depth is backspace or delete reset()
  depthLabelInput.addEventListener('keydown', function (event) {
    if (event.keyCode == 8 || event.keyCode == 46) {
      reset();
    }
  }
  );

  
 


    




