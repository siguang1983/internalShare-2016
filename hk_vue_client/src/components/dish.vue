<style>
	.app_tab { font-family: "Microsoft YaHei"; }
	.dish { padding: 0 10px; }
	.dish_tag { padding: 20px 10px; }
	.tag_name { padding: 10px 5px; cursor: pointer; line-height: 20px;  color: #4b4848; }
	a:hover.tag_name { color: #000; }
	.btn_default { padding: 5px 10px; border-radius: 3px; background-color: #fff; border: 1px #c3c3c3 solid;  }
	.add_dish_box { text-align: right;  position: absolute; right: 40px; top: -6px; }
	.btn_add { padding: 10px 20px; border-radius: 3px; background-color: #242b3c; border: 1px #41700b solid; color: #000; cursor: pointer; }
	.font_a { font-weight: bold; color: #1060a9; }
	.lab { width: 15%; display: inline-block; text-align: right; }
	.inp_box { width: 70%; display: inline-block; }
	.inp_box_40 { width: 40%; display: inline-block; }
	.dish_title { position: relative;}
	.dish_title_name { text-align: center; font-size: 24px; padding-bottom: 20px; color: #5cb85c; margin: 0; }
</style>

<template>
	<div class="main">
		<menu-column></menu-column>

		<div class="dish">

			<!-- 切换类别 -->
			<div class="dish_tag">
				<span class="font_a">选择类别:</span>
				<span>
					<a href="javascript:void(0)" class="tag_name" v-for="dishTagName in dishTagArr" @click="sendDishTableData(dishTagName)">{{ dishTagName }}</a>
				</span>
			</div>
			
			<!-- 表 -->
			<div class="hk_content">
				<div class="dish_title">
					<h2 class="dish_title_name">{{ dishType || '全部'}}</h2>

					<!-- 添加记录 -->
					<div class="add_dish_box">
						<input type="button" class="btn btn-success" @click="showAaddDishDialog()" value="添加菜品">
					</div>
				</div>
				
				<table id="table" class="app_tab" @click="handleEvent($event)"></table>

				<!-- <table class="tab">
					<thead>
						<tr>
							<th width="5%">ID</th>
							<th width="15%">菜品名称</th>
							<th width="10%">菜品图片</th>
							<th width="15%">创建时间</th>
							<th width="10%">菜品价格</th>
							<th width="15%">商店名称</th>
							<th width="10%">菜品类别</th>
							<th width="10%">操作</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colspan="8" v-if="dishData.length <= 0">没有相关数据</td>
						</tr>
						<tr else v-for="(dish, index) in dishData">
							<td>{{ index+1 }}</td>
							<td>{{ dish.dish_name }}</td>
							<td><img :src="dish.dish_img_url" width="80" height="64" alt="" ></td>
							<td>{{ dish.create_time }}</td>
							<td>{{ '￥'+dish.price.toFixed(2) }}</td>
							<td>{{ dish.shop_name }}</td>
							<td>{{ dish.dish_tag }}</td>
							<td>
								<input type="button" class="btn_default" @click="showEditDishDialog(dishData[index])" name="" value="修改">
								<input type="button" class="btn_default" @click="showDeleteDishDialog(dish.id)" name="" value="删除">
							</td>
						</tr>
					</tbody>
				</table> -->
			</div>

			

			<!-- dialog  添加菜品-->
			<modal :show.sync="dia_addDish" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						添加菜品
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<p>
						<label class="lab">菜品类别：</label>
						<span class="inp_box_40">
							<select id="add_inp_shopName" class="form-control" v-model="addDishTag">
								<option value="">请选择类别</option>
								<option v-for="dishTagName in dishTagArr" :value="dishTagName">{{ dishTagName }}</option>
							</select>
						</span>
					</p>
					<p>
						<label class="lab">菜品名称：</label>
						<span class="inp_box">
							<input type="text" class="form-control" name="" id="addDishName" v-model="addDishName" value="">
						</span>
					</p>
					<p>
						<label class="lab">菜品价格：</label>
						<span class="inp_box">
							<input type="text" class="form-control" name="" id="addPrice" v-model="addPrice" value="">
						</span>
					</p>
					<p>
						<label class="lab">商家名称：</label>
						<span class="inp_box">
							<input type="text" class="form-control" name="" id="addShopName" v-model="addShopName" value="">
						</span>
					</p>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="dia_addDish = false">取消</button>
					<button type="button" class="btn btn-success" @click="addDish()">添加</button>
				</div>
			</modal>


			<!-- dialog 删除菜品 -->
			<modal :show.sync="dia_deleteDish" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						删除菜品
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<p class="text-center">确定是否删除当前菜品</p>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="dia_deleteDish = false">取消</button>
					<button type="button" class="btn btn-success" @click="deleteDish()">删除</button>
				</div>
			</modal>


			<!-- dialog 编辑菜品 -->
			<modal :show.sync="dia_editDish" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						编辑菜品
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<p>
						<label class="lab">菜品类别：</label>
						<span class="inp_box_40">
							<select id="editDishTag" class="form-control" v-model="currentEditData.editTagName">
								<option value="">请选择类别</option>
								<option v-for="dishTagName in dishTagArr" :value="dishTagName">{{ dishTagName }}</option>
							</select>
						</span>
					</p>
					<p>
						<label class="lab">菜品名称：</label>
						<span class="inp_box">
							<input type="text" class="form-control" name="" id="editDishName" v-model="currentEditData.editDishName" value="">
						</span>
					</p>
					<p>
						<label class="lab">菜品价格：</label>
						<span class="inp_box">
							<input type="text" class="form-control" name="" id="editPrice" v-model="currentEditData.editPrice" value="">
						</span>
					</p>
					<p>
						<label class="lab">商家名称：</label>
						<span class="inp_box">
							<input type="text" class="form-control" name="" id="editShopName" v-model="currentEditData.editShopName" value="">
						</span>
					</p>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="dia_editDish = false">关闭</button>
					<button type="button" class="btn btn-success" @click="editDish()">确定</button>
				</div>
			</modal>

		</div>
		
	</div>
</template>

<script>

	import { modal } from 'vue-strap';
    import bootstrapTable from '../libs/bootstrap-table/dist/bootstrap-table.js';
    import bootstrapTableCN from '../libs/bootstrap-table/dist/locale/bootstrap-table-zh-CN.js'
	import menuColumn from '../components/menu.vue';

	export default {
		components: {
			menuColumn,
			modal
		},

		data() {
			return {
				dishTagArr: [],		// 标签类别
				dishData: [],		// 菜品数据
				dishType: '',		// 菜品类别
				pageNum: 1,			// 当前页码
				pageSize: 10,		// 一页多少条记录

				// 菜品窗口
				dia_addDish: false,
				dia_editDish: false,
				dia_deleteDish: false,

				// 添加菜品表单
				addDishName: '',
				addPrice: '',
				addShopName: '',
				addDishTag: '',

				// 删除菜品
				deleteID: '',

				// 选中编辑数据
				currentEditData: {
					editDishName: '',
					editPrice: '',
					editShopName: '',
					dishTagName: ''
				}
			}
		},

		methods: {

			// 获取菜品标签
			loadDishTag(){
				var that = this;
				$.ajax({
					url: '/operate/dishTag?v='+(new Date().getTime()),
					type: 'get',
					dataType: 'json',
					success: (response) => {
						console.log('菜品类别', response);
						if(response.statue){
							that.dishTagArr = response.data.content;
						}
						else{
							alert(response.message);
						}
					},
					error: (err) => {
						alert(err);
					}
				})
			},

			// 获取指定菜品类别数据
			sendDishTableData(typeName){
				let that = this;
				let isSelectType = false;

				if(typeName){
					isSelectType = true;
					that.dishType = typeName;
				}

				$('#table').bootstrapTable('destroy').bootstrapTable({
					url: '/operate/selectDish',
					cache: false,
					dataType:'json',
					pagination: true,         		// 分页
	                pageNumber: that.pageNum,       // 初始化加载第一页，默认第一页
	                pageSize: that.pageSize,        // 每页的记录行数（*）
	                pageList: [10,25,50],     		// 可供选择的每页的行数（*）
	                sidePagination: "server", 		// 服务端处理分页

	                // 请求参数
	                queryParams:function(params) {
	                	if(isSelectType){
	                		params.offset = 0;
	                	}

	                    var queryParams = {
							tagName: that.dishType,
							pageNum: params.offset == 0 ? 1 : params.offset / params.limit + 1,
							pageSize: params.limit
						}

						isSelectType = false;
						return queryParams;
	                },

	                // 响应数据
	                responseHandler: function(response){
	                	console.log(response)
						var obj={
	                        "total": response.data.totalElements,		// 总条数
	                        "rows": response.data.content,				// 数据
	                    };
	                	that.dishData = response.data.content;
	                	return obj;
	                },

	                // 处理列
				    columns: [
					    {
					        field: 'id',
		                    title: 'ID',
		                    width: '5%',
		                    align:'center',
		                    formatter: (value, row, index)=>{
		                    	// console.log(value, row, index)
		                    	return index+1
		                    }
					    }, 
					    {
					        field: 'dish_name',
	                        title: '菜品名称',
	                        width: '15%',
	                        align:'center'
					    }, 
					    {
					        field: 'dish_img_url',
	                        title: '菜品图片',
	                        width: '10%',
	                        align:'center',
	                        formatter: (val, row)=>{
	                        	// console.log(val, row);
	                        	return '<img src="'+ val +'" width="80" height="64">';
	                        }
					    }, 
					    {
					        field: 'create_time',
	                        title: '创建时间',
	                        width: '15%',
	                        align:'center'
					    }, 
					    {
					        field: 'price',
	                        title: '菜品价格',
	                        width: '10%',
	                        align:'center',
	                        formatter: (val, row)=>{
	                        	return '￥'+ row.price.toFixed(2);
	                        }
					    }, 
					    {
					        field: 'shop_name',
	                        title: '商店名称',
	                        width: '15%',
	                        align:'center'
					    }, 
					    {
					        field: 'dish_tag',
	                        title: '菜品类别',
	                        width: '10%',
	                        align:'center'
					    }, 
					    {
					        field: 'userName',
	                        title: '操作',
	                        width: '10%',
	                        align:'center',
	                        formatter: (val, row)=>{
	                        	//console.log(val, row);
	                        	return '<input type="button" class="btn_default" data-dish-id="'+ row.id +'" name="" value="修改"> <input type="button" class="btn_default" data-dish-id="'+ row.id +'" name="" value="删除">';
	                        }
					    }
				    ]
				});

				
				// $.ajax({
				// 	url: '/operate/selectDish',
				// 	type: 'get',
				// 	data: {
				// 		tagName: that.dishType,
				// 		pageNum: that.pageNum,
				// 		pageSize: that.pageSize,
				// 		version: (new Date().getTime())
				// 	},
				// 	dataType: 'json',
				// 	success: (response) => {
				// 		console.log('菜品数据', response);

				// 		if(response.statue){
				// 			that.dishData = response.data.content;
				// 		}
				// 		else{
				// 			alert(response.message);
				// 		}
				// 	},
				// 	error: (err) => {
				// 		console.log(err);
				// 	}
				// })
			},

			// 处理表所有点击事件
			handleEvent(event){
				let that = this;
				let evt = event.target;
				let currentDishId = '';

				currentDishId = evt.getAttribute('data-dish-id');

				if(evt.defaultValue == '修改' && evt.nodeName == 'INPUT'){
					this.showEditDishDialog(currentDishId);
				}
				else if(evt.defaultValue == '删除' && evt.nodeName == 'INPUT'){
					this.showDeleteDishDialog(currentDishId);
				}
			},


			// 显示添加菜品窗口
			showAaddDishDialog(){
				this.dia_addDish = true;
			},
			// 添加菜品
			addDish(){
				var that = this;
				if(this.addDishTag == ''){
					alert('请选择菜品类别');
					return false;
				}
				if(this.addDishName == ''){
					alert('菜品名称不能为空');
					return false;
				}
				if(this.addPrice == ''){
					alert('金额不能为空');
					return false;
				}
				if(this.addShopName == ''){
					alert('商家名称不能为空');
					return false;
				}

				$.ajax({
					url: '/operate/addDish',
					type: 'get',
					data: {'dishName': this.addDishName, 'price': this.addPrice, 'shopName': this.addShopName, 'dishTag': this.addDishTag},
					dataType: 'json',
					success: (response)=>{
						console.log('添加菜品', response);
						if(response.statue){
							alert('添加成功');
							that.dia_addDish = false;
							that.sendDishTableData();;
						}	
						else{
							alert(response.message)
						}
					},
					error: (err) => {
						console.log(err)
					}
				})
			},


			// 显示删除菜口窗口
			showDeleteDishDialog(id){
				this.dia_deleteDish = true;
				this.deleteID = id;
			},
			// 删除菜品
			deleteDish(){
				let that = this;
				if(!this.deleteID){
					alert('未获取到菜品id');
					return false;
				}
				
				$.ajax({
					url: '/operate/deleteDish',
					type: 'get',
					data: {'id': this.deleteID, 'version': (new Date().getTime())},
					dataType: 'json',
					success: (response) => {
						console.log('删除菜品', response);
						if(response.statue){
							alert(response.message);
							that.dia_deleteDish = false;
							that.sendDishTableData();
						}
						else{
							alert(response.message);
						}
						that.deleteID = '';
					},
					error: (err) => {
						alert(err);
						that.deleteID = '';
					}
				})	
			},


			// 显示编辑窗口
			showEditDishDialog(id){
				let that = this;
				this.dia_editDish = true;

				this.dishData.forEach(function(data, index){
					if(data.id == id){
						that.currentEditData = {
							id: data.id,
							editDishName: data.dish_name,
							editPrice: data.price,
							editShopName: data.shop_name,
							editTagName: data.dish_tag
						}
					}
				})
			},
			// 编辑菜品
			editDish(){
				let that = this;

				$.ajax({
					url: '/operate/editDish',
					type: 'get',
					data: {
						id: that.currentEditData.id,      				// 菜品id
						dishName: that.currentEditData.editDishName,    // 菜品名称
						price: that.currentEditData.editPrice,       	// 菜品价格
						shopName: that.currentEditData.editShopName,    // 商店名称
						dishTag: that.currentEditData.editTagName,     	// 菜品类别
						version: new Date().getTime()
					},
					dataType: 'json',
					success: (response) => {
						console.log('编辑成功', response);

						if(response.statue){
							alert('编辑成功');
							that.sendDishTableData();
							that.dia_editDish = false;
						}
						else{
							alert(response.message);
						}
					},
					error: (err) =>{
						console.log(err);
					}
				})
			}
		},

		mounted(){
			
			// 获取菜品标签
			this.loadDishTag();

			// 初始化菜品表数据
			this.sendDishTableData();
			
		}
	}
</script>