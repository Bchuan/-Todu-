(function(){
	


var task_list=[];//任务列表
var $add_task=$(".add-task");//
console.log($add_task)
var $task_list=$(".task-list");
init();
delet();
detailed();
//创建一个对象 ，push到数组里面
$add_task.on("submit",function(ev){//提交事件
	ev.preventDefault();//阻止默认事件
	var obj={};
	obj.detail="";
	obj.time="";
	obj.check=false;
	obj.concent=$add_task.find("input").eq(0).val();
	task_list.unshift(obj);
	console.log(task_list);
	$add_task.find("input").eq(0).val(null);
	save();
})

//把数据存储到浏览器
function save(){
	store.set("task",task_list);
	reArray();
	createHtml();
	delet();
	detailed();
	select();
	
}

//把数据取出来，将localStorage原来存储的重新展示出来,初始化
function init(){
	var task=store.get("task")||[];
	console.log(task);
	task_list=task;
	reArray();
	createHtml();
	select();
	
}

function createHtml(){//创建HTML
	$task_list.html(null);
	for(var i=0;i<task_list.length;i++)
	{
		var str=bindHtml(task_list[i]);
		$task_list.append(str);	
	}	
}
function bindHtml(data){//绑定HTML
	var str=null;
	str='<li class="task-item">'+
		'<input type="checkbox" '+(data.check?"checked":"")+' />'+
		'<div class="text">'+data.concent+'</div>'+
		'<div class="detailed">'+
		'<span class="abtn" style="color:blue">删除</span>'+
		'<span class="abtn1">详细</span>'+
		'</div>'+
		'</li>'
	return str;
}

//删除事件
function delet(){
	var $abtn=$(".abtn");
	console.log($abtn)
	$abtn.each(function(index,ele){
		console.log($abtn[index])
		$abtn.eq(index).on("click",function(){
			clearInterval(task_list[index].timer)
			task_list.splice(index,1);
			save();
			var bing=store.get("task");
			console.log(bing)
			
		});
	});
}

//详细编辑
function detailed(){
	var $abtn1=$(".abtn1");
	$abtn1.each(function(index,ele){
		$abtn1.eq(index).on("click",function(){
			console.log(1)
			var sbr='<div class="hide">'+
				'<div class="task-detail">'+
				'<div class="title"><div id="tltle1">'+task_list[index].concent+'</div><img src="img/12.jpg" class="shut"/></div>'+
				'<input style="text" class="intitle">'+	
				'<div><textarea class="desc"  placeholder="事件说明" >'+task_list[index].detail+'</textarea></div>'+
				'<div>提醒时间</div>'+
				'<div><input type="text" id="time"  value="'+task_list[index].time+'" readonly></div>'+
				'<div>提示音乐</div>'+
				'<select>'+
					'<option>浮诛</option>'+
					'<option>素雪风华</option>'+
					'<option>剑心</option>'+
					'<option>剑魂·墨狂</option>'+
					'<option>夜雨江湖</option>'+
				'</select>'+
				'<div><span class="update">更新</span></div>'+
			'</div>'+
			'</div>'
			$task_list.after(sbr);
			var h=$(".task-item").eq(index).offset().top;
			$(".task-detail").css({
				top:h
			});
			shut();
			revise(index);
			onTime();
			Getdeta(index);
		});
	});
}
//点击选择时间框
function onTime(){
	$("#time").on("click",function(){
		GetTime();
	})
}
//双击修改标题
function revise(index){
	console.log($("#tltle1"));
	$("#tltle1").dblclick(function(){
		console.log($(".intitle"))
		$("#tltle1").css({
			"display":"none"
		});
		$(".intitle").css({
			"display":"block"
		});
		$(".intitle").val(task_list[index].concent);
		$(".intitle").change(function(){
			console.log(12)
			$("#tltle1").css({
				"display":"block"
			});
			$(".intitle").css({
				"display":"none"
			});
//			task_list[index].concent=$(".intitle").val();
			$("#tltle1").text($(".intitle").val());
			console.log($("#tltle1").text())
		});
	});
}



//获取详细信息
function Getdeta(index){
	$(".update").on("click",function(){
		console.log($("#tltle1").text());
		task_list[index].concent=$("#tltle1").text();
		task_list[index].detail=$(".desc").val();
		task_list[index].time=$("#time").val();
		task_list[index].music=$("select").val();
		task_list[index].check=true;
		console.log(task_list[index]);
		$("div").remove(".hide");
		
		save();
		Timedown(task_list[index]);
	})
}

//关闭弹窗
function shut(){
	$(".shut").on("click",function(){
		$("div").remove(".hide");
	})
}


//获取时间
function GetTime(){
	var datepickerOptions = {
      dateCell:"#time", //目标元素。由于jedate.js封装了一个轻量级的选择器，因此dateCell还允许你传入class、tag这种方式 '#id .class'
      format:"YYYY-MM-DD hh:mm:ss", //日期格式
      minDate:"2017-01-01 00:00:00", //最小日期
      maxDate:"2099-12-31 23:59:59", //最大日期
      isinitVal:false, //是否初始化时间
      isTime:true, //是否开启时间选择
      isClear:true, //是否显示清空
      festival:false, //是否显示节日
      zIndex:999,  //弹出层的层级高度
      marks:null, //给日期做标注
      choosefun:function(val) {},  //选中日期后的回调
      clearfun:function(val) {},   //清除日期后的回调
      okfun:function(val) {}       //点击确定后的回调
    };
	jeDate(datepickerOptions);
}
	
//开启闹钟
function Timedown(data){
	var current=new Date();
	var target=new Date(data.time);
	var h=target.getTime()-current.getTime();
	clearInterval(data.timer);
	data.timer=setInterval(function(){
		console.log(h)
		if(h<=20000){
			clearInterval(data.timer);
			clearInterval(data.timer1);
			data.timer1=setInterval(function(){
				if(h<=0)
				{
					clearInterval(data.timer1);
					playMusic(data)
				}
				h=h-100;
				console.log(h)
			},100)
		}
		h=h-10000;
	},10000)
}

//音乐播放
function playMusic(data){
	var str='<div class="hide">'+
			'<div class="Playmusic">'+
				'<img src="img/12.jpg" alt="" id="shutM"/>'+
				'<h1>时间到了</h1>'+
				'<h2>'+data.concent+'</h2>'+
				'<p>'+data.detail+'</p>'+
				'<embed id="m_bg_music"  loop=true  volume="60" autostart=true hidden=true src="music/素雪风华.mp3" />'+
			'</div>'+
			'</div>'
	$task_list.after(str);
	shutM();
}
//关闭闹钟
function shutM(){
	$("#shutM").on("click",function(){
		$("div").remove(".hide");
	})
}

//单选框事件
function select(){
	var $task_items=$(".task-item")
//	console.log($task_items);
	for(var i=0;i<task_list.length;i++)
	{
//		console.log($task_items.eq(i).index())
		$task_items.eq(i).find("input").click(function(){
//			console.log(this.checked)
//			console.log($(this).parent().index())
			var index=$(this).parent().index();
			task_list[index].check=this.checked;
			save();
			
			if(this.checked)
			{
//				console.log(2)
				if(task_list[index].time=="") return;
				var current=new Date();
				var iTarget=new Date(task_list[index].time);
				if(iTarget<current) return;
//				console.log(4)
				Timedown(task_list[index]);
			}
			else{
//				console.log(3)
				clearInterval(task_list[index].timer);
			}		
		});
	}
}

//点击单选框后重排
function reArray(){
//	console.log(100)
	var arr1=[];
	var arr2=[];
	for(var i=0;i<task_list.length;i++){
		if(task_list[i].check)
		{
			arr1.push(task_list[i]);
		}
		else{
			arr2.push(task_list[i]);
		}
	}
//	console.log(arr1);
//	console.log(arr2);
	var arr=arr2.concat(arr1);
//	console.log(arr);
	for(var i=0;i<task_list.length;i++)
	{
		task_list[i]=arr[i];
	}
	
}

}());