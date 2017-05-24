(function(){
var Surface = function(node){
    var heightFunction
        ,colorFunction
        ,timer
        ,timer
        ,transformPrecalc = [];
    var displayWidth = 800
        ,displayHeight = 0
        ,zoom = 1;
    var trans;
 
    var ad = [{
            x: 00
            ,xl: 10
            ,y: 0
            ,yl: 10
            ,z: 0
            ,zl: 10
            ,tx:0
            ,ty:0
            ,tz:0
            ,dx:0
            ,dy:0
            ,depth:0
        },{
            x: 0
            ,xl: 10
            ,y: 9
            ,yl: 10
            ,z: 0
            ,zl: 10
            ,dx:0
            ,dy:0
            ,depth:0
        },{
            x: 0
            ,xl: 10
            ,y: 0
            ,yl: 10
            ,z: 180
            ,zl: 10
            ,dx:0
            ,dy:0
            ,depth:0
        },{
            x: 9
            ,xl: 10
            ,y: 0
            ,yl: 10
            ,z: 0
            ,zl: 10
            ,dx:0
            ,dy:0
            ,depth:0
        }];
 
    this.setZoom = function(zoomLevel){
        zoom = zoomLevel;
        if(timer) clearTimeout(timer);
        timer = setTimeout(renderSurface);
    };
 
    var mindepth = 1e6
        ,maxdepth = 0;
 
 
    var getTransformedData = function(data){
        var dl = data.length;
        if(!heightFunction) return [[]];
        for(var i = 0; i < dl; i++){
            var a = (data[i].x - data[i].xl / 2) / (data[i].xl * 1.41) * displayWidth * zoom
                ,b = data[i].z * zoom
                ,c = (data[i].y - data[i].yl / 2) / (data[i].yl * 1.41) * displayWidth * zoom
                ,tx = transformPrecalc[0] * a + transformPrecalc[1] * b + transformPrecalc[2] * c
                ,ty = transformPrecalc[3] * a + transformPrecalc[4] * b + transformPrecalc[5] * c
                ,tz = transformPrecalc[6] * a + transformPrecalc[7] * b + transformPrecalc[8] * c;
            data[i].dx = (tx + displayWidth / 2).toFixed(10);
            data[i].dy = (ty + displayHeight / 2).toFixed(10);
            var x2 = data[i].x + (data[i].h * Math.sin(data[i].psi) * Math.cos(data[i].theta))
                ,y2 = data[i].y + (data[i].h * Math.sin(data[i].psi) * Math.sin(data[i].theta))
                ,z2 = data[i].z + (data[i].h * Math.cos(data[i].psi))
                ,a2 = (x2 - data[i].xl / 2) / (data[i].xl * 1.41) * displayWidth * zoom
                ,b2 = z2 * zoom
                ,c2 = (y2 - data[i].yl / 2) / (data[i].yl * 1.41) * displayWidth * zoom
                ,tx2 = transformPrecalc[0] * a2 + transformPrecalc[1] * b2 + transformPrecalc[2] * c2
                ,ty2 = transformPrecalc[3] * a2 + transformPrecalc[4] * b2 + transformPrecalc[5] * c2
                ,tz2 = transformPrecalc[6] * a2 + transformPrecalc[7] * b2 + transformPrecalc[8] * c2;
            data[i].dx2 = (tx2 + displayWidth / 2).toFixed(10);
            data[i].dy2 = (ty2 + displayHeight / 2).toFixed(10);
            var depth = tz + findtz(data[i].x + 1, data[i].y) + findtz(data[i].x + 1, data[i].y + 1) + findtz(data[i].x, data[i].y + 1);
            data[i].depth = depth;
            if(depth > maxdepth) maxdepth = depth;
            if(depth < mindepth) mindepth = depth;
        }
        return data;
    };
 
    function findtz (x,y) {
        var data = node.datum()
            ,dl = data.length
            ,tz = 0;
        for(var i = 0; i < dl; i++){
            if(data[i].x === x && data[i].y === y){
                var a = (data[i].x - data[i].xl / 2) / (data[i].xl * 1.41) * displayWidth * zoom
                    ,b = data[i].z * zoom
                    ,c = (data[i].y - data[i].yl / 2) / (data[i].yl * 1.41) * displayWidth * zoom
                tz = transformPrecalc[6] * a + transformPrecalc[7] * b + transformPrecalc[8] * c;
            }
        }
        return tz;
    }
 
    var renderSurface = function(){
        var od = node.datum()
            ,data = getTransformedData(od)
            ,axisdata = getTransformedData(ad);
        data.sort(function(a, b){return b.depth - a.depth});
 
        var opacityscale = d3.scale.linear()
            .domain([mindepth, maxdepth])
            .range([1,1e-6]);
 
        //axis
        var daxis = []
            ,al = axisdata.length;
        for(i = 1; i < al; i++){
            daxis.push({
                path: 'M'+ axisdata[0].dx + ',' + axisdata[0].dy + 'L' + axisdata[i].dx + ',' + axisdata[i].dy
            });
        }
 
        var axis = node.selectAll('path').data(daxis);
        axis.enter().append("path");
        if(trans){
            axis = axis.transition().delay(trans.delay()).duration(trans.duration());
        }
        axis.attr("d",function(d){return d.path;});
        trans = false;
 
        //vector lines
        var v = node.selectAll("line").data(data);
        v.enter().append("line");
        v.attr("x1", function(d){return d.dx;})
            .attr("x2", function(d){return d.dx2;})
            .attr("y1", function(d){return d.dy;})
            .attr("y2", function(d){return d.dy2;})
            .attr("stroke-width", 1);
        if(colorFunction){
            v.attr("stroke", function(d){return colorFunction(d.z)})
                .attr("stroke-opacity", function(d){return opacityscale(d.depth);});
        }
    };
 
    this.renderSurface = renderSurface;
 
    this.setTurtable = function(yaw, pitch){
        var cosA = Math.cos(pitch);
        var sinA = Math.sin(pitch);
        var cosB = Math.cos(yaw);
        var sinB = Math.sin(yaw);
        transformPrecalc[0] = cosB;
        transformPrecalc[1] = 0;
        transformPrecalc[2] = sinB;
        transformPrecalc[3] = sinA * sinB;
        transformPrecalc[4] = cosA;
        transformPrecalc[5] = -sinA * cosB;
        transformPrecalc[6] = -sinB * cosA;
        transformPrecalc[7] = sinA;
        transformPrecalc[8] = cosA * cosB;
        if(timer) clearTimeout(timer);
        timer = setTimeout(renderSurface);
        return this;
    };
 
    this.setTurtable(2.0, 0.1);
    this.surfaceColor = function(callback){
        colorFunction = callback;
        if(timer) clearTimeout(timer);
        timer = setTimeout(renderSurface);
        return this;
    };
    this.surfaceHeight = function(callback){
        heightFunction = callback;
        if(timer) clearTimeout(timer);
        timer = setTimeout(renderSurface);
        return this;
    };
    this.transition = function(){
        var transition = d3.selection.prototype.transition.bind(node)();
        colourFunction = null;
        heightFunction = null;
        transition.surfaceHeight = this.surfaceHeight;
        transition.surfaceColor = this.surfaceColor;
        trans = transition;
        return transition;
    };
    this.setHeight = function(height){
        if(height) displayHeight = height;
    };
    this.setWidth = function(width){
        if(width) displayWidth = width;
    };
};
 
d3.selection.prototype.surface3D = function(width, height){
    if(!this.node().__surface__) this.node().__surface__=new Surface(this);
    var surface = this.node().__surface__;
    this.turntable = surface.setTurtable;
    this.surfaceColor = surface.surfaceColor;
    this.surfaceHeight = surface.surfaceHeight;
    this.zoom = surface.setZoom;
    surface.setHeight(height);
    surface.setWidth(width);
    this.transition = surface.transition.bind(surface);
    return this;
};            
})();
