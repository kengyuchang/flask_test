if(!window.ol){
	window.ol={};
}(
	function(){
		var $=jQuery;
		ol.loading=function(options){
			//var b=this;
			this.loadingImg;
			this.loadingMask;
			this.container;
			
			var d={
				id:null,
				loadingClass:null,
				zIndex:800
			};
			
			this.init=function(){

				options=$.extend({},d,options);
				this.container=$("#"+options.id);
				var e=this.container.css("position");
				var g=this.container.outerWidth();
				e=e=="absolute"?"absolute":"relative";
				g=g>0?g:"";

				/*var h=$("<span></span>").css({
					position:e,
					top:this.container.css("top"),
					left:this.container.css("left"),
					right:this.container.css("right"),
					bottom:this.container.css("bottom"),
					width:g
				});*/
				
				/*this.container.css({
					position:"relative",
					width:"100%",
					top:"auto",
					right:"auto",
					left:"auto",
					bottom:"auto"
				}).wrap(h);*/
				
				this.loadingMask=$('<div class="ol_loading_mask"></div>');
				this.loadingMask.css({
					zIndex:options.zIndex
				});
				
				this.loadingImg=$('<div class="ol_loading"></div>').css("z-index",options.zIndex+1);
				
				if(!options.loadingClass){
					this.loadingImg.addClass(options.loadingClass);
					this.loadingMask.addClass(options.loadingClass+"_mask");
				}
				
				this.container.parent().append(this.loadingMask).append(this.loadingImg);
				this.loadingMask.bgiframe();
			};
			
			this.show=function(){
				if($.browser.msie&&/6.0/.test(navigator.userAgent)){
					this.loadingMask.css({
						width:document.documentElement.clientWidth, //this.container.outerWidth()
						height:document.documentElement.clientHeight //this.container.outerHeight()
					});
				}
				this.loadingMask.css("display","block");
				this.loadingImg.css("display","block");
			};
			
			this.hide=function(){
				this.loadingMask.css("display","none");
				this.loadingImg.fadeOut(0);
			};
			
			this.init();
		};
	}
)();
