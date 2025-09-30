//animation 
let grapOptions={
      
  //tree shape
    
    layout: { 
      hierarchical: {
        enabled: true,
        direction: "UD",
        sortMethod: "directed",
        levelSeparation: 150,
        nodeSpacing: 100,
        treeSpacing: 200,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        //direction: "LR",        // UD, DU, LR, RL
        //sortMethod: "hubsize"   // hubsize, directed


      }
      
    },
    physics: {
      enabled: true,
      barnesHut: {
        gravitationalConstant: -80000,
        centralGravity: 0.3,
        springLength: 95,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 0
      },
      maxVelocity: 146,
      minVelocity: 0.75,
      solver: 'barnesHut',
      timestep: 0.5,
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 100,
        onlyDynamicEdges: false,
        fit: true,
        
      },
      
      adaptiveTimestep: true
    },
   //zoom: 
    interaction: {
      dragNodes: true,
     
      zoomView: true
    },
    edges: {
      arrows: {
        to:     {enabled: true, scaleFactor:1, type:'arrow'},
        middle: {enabled: false, scaleFactor:1, type:'arrow'},

        from:   {enabled: false, scaleFactor:1, type:'arrow'}
      },
      arrowStrikethrough: false,
     
      color: {
        color:'#848484',
        highlight:'#848484',
        hover: '#848484',
        inherit: 'from',
        opacity:1.0
      },
      //smooth off
      smooth: {
        enabled: false,
        type: "continuous",
        roundness: 0.5
      },

options: {
//shape

      nodes: {
        shape: 'dot',
        size: 30,
        font: {
          size: 15,
          color: '#000000'
        },
        borderWidth: 2, 
        borderWidthSelected: 2,
        // chosen: {
        //   label: function (values, id, selected, hovering) {
        //     values.color = 'red';
        //     values.size = 30;
        //     values.font = '30px arial red';
        //     return values;
        //   }
        // },
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          highlight: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          },
          hover: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          }}}
        }



  }
  
  }
  


  //end of animation
