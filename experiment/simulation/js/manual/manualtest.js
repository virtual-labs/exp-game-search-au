
let depthLabelInput = document.getElementById("depth-label");


// document.getElementById('depth-button');
  let nodeArray1 = [];
  let edgeArray1 = [];
  
  let nodes= new vis.DataSet(nodeArray1);
  let edges = new vis.DataSet(edgeArray1);
 
    //values
    let values1=[[],[]];
    let tableArray1=[];
    //count
    
    
    var container = document.getElementById('mynetwork');
    var data = { nodes: nodes, edges: edges };
    var options = { };
    var network = new vis.Network(container, data, options);


    
  
 //call grapOtion in vis.network
    var network = new vis.Network(container, data, options);
   
 network.setOptions(grapOptions);
 disableSubmitButton();
//add eventlisterner to create a new node
network.on("doubleClick", function (params) {
  
  //more than 3 nodes can't be added without edges

  if(params.nodes.length ===0 && params.edges.length ===0){

    
    var newNodeid=nodes.get().length + 1;
    var newNodelabel= "Node " + newNodeid;
    var firstchild = null;
    var secondchild = null;
    var thirdchild = null;
    var fourthchild = null;
    var newNode={id:newNodeid,
       label:newNodelabel,
        firstchild:firstchild,
        secondchild:secondchild,
        thirdchild:thirdchild,
        fourthchild:fourthchild,

      //  x: params.pointer.canvas.x,
      //   y: params.pointer.canvas.y,
      //   fixed:{x:true,
      //      y:true,
          
    } 
  ;
 nodes.add(newNode);
  nodeArray1.push(newNode);       
 updateDepth();
  }
  
}
);
//enable submit button
function enableSubmitButton(){
  
    document.getElementById("submit").disabled = false;
  
}
//disable submit button
function disableSubmitButton(){
  document.getElementById("submit").disabled = true;
}
let selectedNode = null;
//drag to connect edges
var level=0;
network.on("click", function (params) {

 


  if(params.nodes.length >0 && params.nodes[0] === selectedNode){
    selectedNode = null;
  }
  //if node is a child of another node then don't select
  if(params.nodes.length >0 && selectedNode !=null){
    var fromNode = nodes.get(selectedNode);
    var toNode = nodes.get(params.nodes[0]);
    var label="";

    
    if(fromNode.firstchild == toNode.id || fromNode.secondchild == toNode.id || fromNode.thirdchild == toNode.id || fromNode.fourthchild == toNode.id){
      selectedNode = null;
    }
  }
  //if node is not a child of another node then select
  if(params.nodes.length >0){
    if(selectedNode === null){
      selectedNode = params.nodes[0];
  }
  //update leftchild and rightchild from fromnode and tonode
  else{
    //
    var fromNode = nodes.get(selectedNode);
    var toNode = nodes.get(params.nodes[0]);
    var label ="";
    // check if toNode is a child of any other nodes
    for (var i = 0; i < nodeArray1.length; i++) {
      if (nodeArray1[i].firstchild == toNode.id || nodeArray1[i].secondchild == toNode.id || nodeArray1[i].thirdchild == toNode.id || nodeArray1[i].fourthchild == toNode.id) {
        return;
      }
    }

    var newEdge = {from:fromNode.id, to:toNode.id,label:label};
    edges.add(newEdge);
    edgeArray1.push(newEdge);

        for (var i = 0; i < nodeArray1.length; i++) {
      if (nodeArray1[i].id == fromNode.id) {
        if (nodeArray1[i].firstchild == null&& nodeArray1[i].secondchild == null&& nodeArray1[i].thirdchild == null&& nodeArray1[i].fourthchild == null) {
          nodeArray1[i].firstchild = toNode.id;
        }
        else if (nodeArray1[i].firstchild != null&& nodeArray1[i].secondchild == null&& nodeArray1[i].thirdchild == null&& nodeArray1[i].fourthchild == null) {
          nodeArray1[i].secondchild = toNode.id;
        }
        else if (nodeArray1[i].firstchild != null&& nodeArray1[i].secondchild != null&& nodeArray1[i].thirdchild == null&& nodeArray1[i].fourthchild == null) {
          nodeArray1[i].thirdchild = toNode.id;
        }
        else if (nodeArray1[i].firstchild != null&& nodeArray1[i].secondchild != null&& nodeArray1[i].thirdchild != null&& nodeArray1[i].fourthchild == null) {
          nodeArray1[i].fourthchild = toNode.id;
        }
      }
    }
    selectedNode = null;
  }
  }
  updateDepth();
  }
);
console.log(nodeArray1);
console.log(edgeArray1);


//function to update depth of tree
function updateDepth(){
  var size=nodes.get().length;
  var s=''+size;
 depthLabelInput.value = s;
 console.log(depthLabelInput.value);

}

//update depth of tree
  console.log(depthLabelInput.value);


//add eventlisterner hold edge to delete edge
network.on("hold", function (params) {
  if(params.edges.length ==1){
    edges.remove(params.edges[0]);
    for (var i = 0; i < edgeArray1.length; i++) {
      if (edgeArray1[i].id == params.edges[0]) {
        edgeArray1.splice(i, 1);
        nodeArray1[i].firstchild = null;
        nodeArray1[i].secondchild = null;
        nodeArray1[i].thirdchild = null;
        nodeArray1[i].fourthchild = null;

      }
    }
  }
}
);
console.log(nodeArray1);
//add eventlisterner to updatelabel
network.on("doubleClick", function (params) {
  
  params.event = "[original event]";
  if (params.nodes.length == 1) {
    //if node has no child
    // if (nodes.get(params.nodes[0]).firstchild == null) {
if(params.nodes[0]<=depthLabelInput.value){
  enableSubmitButton();
      //after value entered deselect node
      selectedNode = null;
      var id = params.nodes[0];
      var label = prompt("Enter new label for node " + id);
      //if label is not a number then alert
      if(isNaN(label)){
        alert("Please enter a number");
        return;
      }
      var firstchild = null;
      var secondchild = null;
      var thirdchild = null;
      var fourthchild = null;

      updateLabel1(id, label,firstchild,secondchild, thirdchild,fourthchild);
values1.push([params.nodes[0], label,firstchild,secondchild, thirdchild,fourthchild])

      
    }
  }
}
);
console.log(nodeArray1);

//add eventlisterner to deselect node
network.on("click", function (params) {
  if (params.nodes.length == 0) {
    selectedNode = null;
  }
}
);

  
//copy the values of values1 to nodeArray1
function copyValues(){
  for(var i=0;i<values1.length;i++){
   nodeArray1[i].nodeValue=values1[i][1];
  }
  pushTableArray();
}
//push the value of nodeArray1 to tableArray1
function pushTableArray(){
  for(var i=0;i<nodeArray1.length;i++){ 
    tableArray1.push([nodeArray1[i].id,nodeArray1[i].label,nodeArray1[i].firstchild,nodeArray1[i].secondchild,nodeArray1[i].thirdchild,nodeArray1[i].fourthchild,nodeArray1[i].nodeValue]);
  }
}

//if user create complete tree then call minmax() function
function minmax() {
  var size = nodes.get().length;
  if (size == 2 ** document.getElementById('depth-label').value - 1) {
    minmax1();
  }
  else {
    alert("Please create a complete tree");
  }
}
//minmax algorith traverse the tree and find minimum and maximum value
function minmax1() {
 
  var alpha = -100000;
  var beta = 100000;
  let ismax = true;
  var depth = 0;
  depth = Math.floor(Math.log2(nodes.get().length));
  
 var count=nodes.get().length;
 


  //for each node in the tree
  for (var i = count; i >0; i--) {

    nodeArray1[i-1].nodeValue=parseInt(nodeArray1[i-1].nodeValue);
    depth=Math.floor(Math.log2(i));
    //if node is leaf node
    if(nodeArray1[i-1].firstchild==null && nodeArray1[i-1].secondchild==null && nodeArray1[i-1].thirdchild==null && nodeArray1[i-1].fourthchild==null){
      nodeArray1[i-1].nodeValue=nodeArray1[i-1].label;
      updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
      updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
      nodes.update({ id: i, label: nodeArray1[i-1].nodeValue,  font : {color : '#000001' ,size : 25}});
      console.log(nodeArray1[i-1].nodeValue);
    }
    //if node is not leaf node
    else{
      //change ismax value based on depth
      if(depth%2==0){
        ismax=true;
      }
      else{
        ismax=false;
      }

      //ismax is true change node shapes to square
      if (ismax) {
            
        nodeArray1[i - 1].shape = 'dot';
       

        //update node shape
        nodes.update({ id: i,size :20,  font : {color : '#000000' ,size : 25}});
      }
      //ismax is false change node shapes to circle
      else  {
        nodeArray1[i - 1].shape = 'square';
        //update node shape
        nodes.update({ id: i,size :20,  font : {color : '#000000' ,size : 25}});
      }
      //else change the node shape to diamond
      
    

      
      //if node is max node
      if(ismax==true){
        //if node has 4 children
        if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild!=null && nodeArray1[i-1].thirdchild!=null && nodeArray1[i-1].fourthchild!=null){
          //convert firstchild secondchild thirdchild fourthchild value to integer
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue);
          //find maximum value of firstchild secondchild thirdchild fourthchild


          nodeArray1[i-1].nodeValue=Math.max(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue,nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue,nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue,nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue);
         updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          // updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Max ("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+
          " , "+'<br>'+"Secondchild "+nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue+
          " , "+'<br>'+"Thirdchild "+nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue+
          " , "+'<br>'+"Fourthchild "+nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue+ ") = <span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
        //showoperation

        //if node has 3 children
        else if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild!=null && nodeArray1[i-1].thirdchild!=null && nodeArray1[i-1].fourthchild==null){
          
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue);

          nodeArray1[i-1].nodeValue=Math.max(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue,nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue,nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue);
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Max ("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+
          ","+'<br>'+"Secondchild "+nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue+
          ","+'<br>'+"Thirdchild "+nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
        //if node has 2 children
        else if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild!=null && nodeArray1[i-1].thirdchild==null && nodeArray1[i-1].fourthchild==null){
          
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);

          nodeArray1[i-1].nodeValue=Math.max(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue,nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);

          var msg="Node "+i+"= Max ("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+
          ","+'<br>'+"Secondchild "+nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
        //if node has 1 children
        else if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild==null && nodeArray1[i-1].thirdchild==null && nodeArray1[i-1].fourthchild==null){
          
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);

          nodeArray1[i-1].nodeValue=nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue;
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
        
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Max ("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
      }
      //if node is min node
      else{
        //if node has 4 children
        if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild!=null && nodeArray1[i-1].thirdchild!=null && nodeArray1[i-1].fourthchild!=null){
          
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue);

          nodeArray1[i-1].nodeValue=Math.min(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue,nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue,nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue,nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue);
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Min("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+
          ","+'<br>'+"Secondchild "+nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue+
          ","+'<br>'+"Thirdchild "+nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue+
          ","+'<br>'+"Fourthchild "+nodeArray1[nodeArray1[i-1].fourthchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
        //if node has 3 children
        else if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild!=null && nodeArray1[i-1].thirdchild!=null && nodeArray1[i-1].fourthchild==null){
          
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue);

          nodeArray1[i-1].nodeValue=Math.min(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue,nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue,nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue);
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Min ("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+
          ","+'<br>'+"Secondchild "+nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue+
          ","+'<br>'+"Thirdchild "+nodeArray1[nodeArray1[i-1].thirdchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);
        }
        //if node has 2 children
        else if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild!=null && nodeArray1[i-1].thirdchild==null && nodeArray1[i-1].fourthchild==null){
         
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);

          nodeArray1[i-1].nodeValue=Math.min(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue,nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue);
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Min ("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+
          ","+'<br>'+"Secondchild "+nodeArray1[nodeArray1[i-1].secondchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
        //if node has 1 children
        else if(nodeArray1[i-1].firstchild!=null && nodeArray1[i-1].secondchild==null && nodeArray1[i-1].thirdchild==null && nodeArray1[i-1].fourthchild==null){
          
          nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue=parseInt(nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue);
          nodeArray1[i-1].nodeValue=nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue;
          updateEdgeLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          //updateLabel1(i,nodeArray1[i-1].nodeValue,nodeArray1[i-1].firstchild,nodeArray1[i-1].secondchild,nodeArray1[i-1].thirdchild,nodeArray1[i-1].fourthchild);
          console.log(nodeArray1[i-1].nodeValue);
          var msg="Node "+i+"= Min("+"Firstchild "+nodeArray1[nodeArray1[i-1].firstchild-1].nodeValue+")=<span class ='light' >"+nodeArray1[i-1].nodeValue;
          showoperation1(msg);

        }
      }
    }
  }
 


  //display node value
  displayNodeValue1();
  //display info1
  displayInfo1();
  //highlight
  highlightNode1();
}
info1=0;
function displayInfo1(){  
  //only run one time
  if(info1==0){
    info1=1;
    //display info
    //document.getElementById("left").innerHTML+="Square - Minimizer"+"<br>"+ "circle -Maximizer"+"<br>";
  }
}

function updateEdgeLabel1(id, label,firstchild,secondchild, thirdchild,fourthchild) {
  edges.update({ id: id, label: label, firstchild:firstchild, secondchild:secondchild, thirdchild:thirdchild, fourthchild:fourthchild });
  //convert label to string
  label = label.toString();
  //update edge array
  if(id-2>=0)
  {
  edgeArray1[id-2].label = label;
  edgeArray1[id - 2].firstchild = firstchild;
  edgeArray1[id - 2].secondchild = secondchild;
  edgeArray1[id - 2].thirdchild = thirdchild;
  edgeArray1[id - 2].fourthchild = fourthchild;

  //edge label color
  edgeArray1[id - 2].color = "red";
  //edge label font
  edgeArray1[id - 2].font = { color: "black" };
  //edge label size
  edgeArray1[id - 2].font.size = 20;
  //update graph
  edges.update(edgeArray1);
  console.log(edgeArray1);
}
}
  
//function to update graph label
function updateLabel1(id, label,firstchild,secondchild, thirdchild,fourthchild) {
console.log("update label"+id);
//convert label to string
label=label.toString();
  nodes.update({ id: id, label: label, firstchild:firstchild, secondchild:secondchild, thirdchild:thirdchild, fourthchild:fourthchild }); 
  nodeArray1[id - 1].label=label;
  nodeArray1[id - 1].firstchild=firstchild;
  nodeArray1[id - 1].secondchild=secondchild;
  nodeArray1[id - 1].thirdchild=thirdchild;
  nodeArray1[id - 1].fourthchild=fourthchild;

  nodes.update(nodeArray1);
  edges.update(edgeArray1);
  tableArray1.push([id,
    label,
    firstchild,secondchild, thirdchild,fourthchild]);
  }


//display node value
function displayNodeValue1(){
  //get table 
  var table = document.getElementById("table1");
  //clear table
  table.innerHTML = "";
  //create table header
  var header = "<tr><th>Node</th><th>Value</th></tr>";
  //initialize cell  
  var cell = "";
  //for each 
  for(var i=0;i<nodeArray1.length;i++){
    //create table row
    cell += "<tr><td>"+'Node'+nodeArray1[i].id+"</td><td>"+nodeArray1[i].nodeValue+"</td></tr>";
  }
  //add table to html 
  table.innerHTML = header + cell; 
}

//highlight node and edge
function highlightNode1(){
  //if root is max
  if(nodeArray1[0].nodeValue==nodeArray1[0].nodeValue){
    //highlight root
    nodes.update({ id: 1, color: '#e28c2a' });
    //highlight edge
    edges.update({ id: 1, color: 'red' });
  }
  
  //for each node
  for(var i=0;i<nodeArray1.length;i++){
//if node is a max node
    if(nodeArray1[i].nodeValue==nodeArray1[i].nodeValue){
      //highlight node
      nodes.update({ id: nodeArray1[i].id, color: '#e28c2a' });
      //highlight edge
      edges.update({ id: nodeArray1[i].id, color: 'red' });
    }
    //if node has 2 children
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild!=null && nodeArray1[i].thirdchild==null && nodeArray1[i].fourthchild==null){
      //if firstchild is max
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'red' });
      }
      //if secondchild is max
      else if (nodeArray1[nodeArray1[i].secondchild - 1].nodeValue ==nodeArray1[nodeArray1[i].secondchild-1].nodeValue){
        //highlight secondchild
        nodes.update({ id: nodeArray1[i].secondchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].secondchild, color: 'red' });
      }
    }
    //if node has 3 children
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild!=null && nodeArray1[i].thirdchild!=null && nodeArray1[i].fourthchild==null){
      //if firstchild is max
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'red' });
      }
      //if secondchild is max
      else  if (nodeArray1[nodeArray1[i].secondchild - 1].nodeValue ==nodeArray1[nodeArray1[i].secondchild-1].nodeValue){
        //highlight secondchild
        nodes.update({ id: nodeArray1[i].secondchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].secondchild, color: 'red' });
      }
      //if thirdchild is max
      else  if (nodeArray1[nodeArray1[i].thirdchild - 1].nodeValue ==nodeArray1[nodeArray1[i].thirdchild-1].nodeValue){
        //highlight thirdchild
        nodes.update({ id: nodeArray1[i].thirdchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].thirdchild, color: 'red' });
      }
    }
    //if node has 4 children
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild!=null && nodeArray1[i].thirdchild!=null && nodeArray1[i].fourthchild!=null){
      //if firstchild is max
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: '#e28c2a' });

        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'red' });
      }
      //if secondchild is max
      else  if (nodeArray1[nodeArray1[i].secondchild - 1].nodeValue ==nodeArray1[nodeArray1[i].secondchild-1].nodeValue){
        //highlight secondchild
        nodes.update({ id: nodeArray1[i].secondchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].secondchild, color: 'red' });
      }
      //if thirdchild is max
      else  if (nodeArray1[nodeArray1[i].thirdchild - 1].nodeValue ==nodeArray1[nodeArray1[i].thirdchild-1].nodeValue){
        //highlight thirdchild
        nodes.update({ id: nodeArray1[i].thirdchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].thirdchild, color: 'red' });
      }
      //if fourthchild is max
      else  if (nodeArray1[nodeArray1[i].fourthchild - 1].nodeValue ==nodeArray1[nodeArray1[i].fourthchild-1].nodeValue){
        //highlight fourthchild
        nodes.update({ id: nodeArray1[i].fourthchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].fourthchild, color: 'red' });
      }
    }
    //if node has 1 child
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild==null && nodeArray1[i].thirdchild==null && nodeArray1[i].fourthchild==null){
      //if firstchild is max
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: '#e28c2a' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'red' });
      }
    }

    //if node is min node
    if(nodeArray1[i].nodeValue==nodeArray1[0].nodeValue){
      //highlight node
      nodes.update({ id: nodeArray1[i].id, color: 'green' });
      //highlight edge
      edges.update({ id: nodeArray1[i].id, color: 'green' });
    }

    //if node has 4 children
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild!=null && nodeArray1[i].thirdchild!=null && nodeArray1[i].fourthchild!=null){
      //if firstchild is min
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'green' });
      }
      //if secondchild is min
      else  if (nodeArray1[nodeArray1[i].secondchild - 1].nodeValue ==nodeArray1[nodeArray1[i].secondchild-1].nodeValue){
        //highlight secondchild
        nodes.update({ id: nodeArray1[i].secondchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].secondchild, color: 'green' });
      }
      //if thirdchild is min
      else  if (nodeArray1[nodeArray1[i].thirdchild - 1].nodeValue ==nodeArray1[nodeArray1[i].thirdchild-1].nodeValue){
        //highlight thirdchild
        nodes.update({ id: nodeArray1[i].thirdchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].thirdchild, color: 'green' });
      }
      //if fourthchild is min
      else  if (nodeArray1[nodeArray1[i].fourthchild - 1].nodeValue ==nodeArray1[nodeArray1[i].fourthchild-1].nodeValue){
        //highlight fourthchild
        nodes.update({ id: nodeArray1[i].fourthchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].fourthchild, color: 'green' });
      }
    }
    //if node has 3 children
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild!=null && nodeArray1[i].thirdchild!=null && nodeArray1[i].fourthchild==null){
      //if firstchild is min
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'green' });
      }
      //if secondchild is min
      else  if (nodeArray1[nodeArray1[i].secondchild - 1].nodeValue ==nodeArray1[nodeArray1[i].secondchild-1].nodeValue){
        //highlight secondchild
        nodes.update({ id: nodeArray1[i].secondchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].secondchild, color: 'green' });
      }
      //if thirdchild is min
      else  if (nodeArray1[nodeArray1[i].thirdchild - 1].nodeValue ==nodeArray1[nodeArray1[i].thirdchild-1].nodeValue){
        //highlight thirdchild
        nodes.update({ id: nodeArray1[i].thirdchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].thirdchild, color: 'green' });
      }
    }
    //if node has 2 children
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild!=null && nodeArray1[i].thirdchild==null && nodeArray1[i].fourthchild==null){
      //if firstchild is min
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'green' });
      }
      //if secondchild is min
      else  if (nodeArray1[nodeArray1[i].secondchild - 1].nodeValue ==nodeArray1[nodeArray1[i].secondchild-1].nodeValue){
        //highlight secondchild
        nodes.update({ id: nodeArray1[i].secondchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].secondchild, color: 'green' });
      }
    }

    //if node has 1 child
    if(nodeArray1[i].firstchild!=null && nodeArray1[i].secondchild==null && nodeArray1[i].thirdchild==null && nodeArray1[i].fourthchild==null){
      //if firstchild is min
      if (nodeArray1[nodeArray1[i].firstchild - 1].nodeValue ==nodeArray1[nodeArray1[i].firstchild-1].nodeValue){
        //highlight firstchild
        nodes.update({ id: nodeArray1[i].firstchild, color: 'green' });
        //highlight edge
        edges.update({ id: nodeArray1[i].firstchild, color: 'green' });
      }

      

  }

  }
  var msg="<span class ='light' >The optimal value is "+nodeArray1[0].nodeValue;
      //showoperation
      showoperation1(msg);
}

   //function to show operations of minmax()
   function showoperation1(message,classname='msg') {

    //get operations div
    let operations = document.getElementById('operations');
    //add message to operations div
    operations.innerHTML += message + "<br>";
    //append
    
    operations.appendChild(document.createElement('br'));

  }
  //function to reset graph
function resetGraph(){
  //reset all
  location.reload();
}





    
    

  
    

//





   