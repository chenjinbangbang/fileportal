<template>
	<div class="animated fadeIn filelist">
		<div class="search">
			<Button type="success" @click="accounts">新建用户</Button>
		</div>

		<Table :columns="columns1" :data="data1"></Table>

		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>

		<Modal v-model="modal1" title="修改权限" class="xgqx">
			<Collapse>
				<Panel v-for="xxx in data2" key="index">
					{{xxx.title}}
					<p class="kg"></p>
					<i-switch size="small" class="switch"></i-switch>
					<div slot="content">
						<P v-for="yyy in xxx.children" key="index">
							{{yyy.title}}
							<i-switch size="small" class="switch"></i-switch>
						</P>
					</div>
				</Panel>
			</Collapse>
		</Modal>

		<Modal v-model="modal2" title="用户信息" @on-ok="saveForm" :loading="loading">
			<Form :model="dataForm" ref="dataForm" :label-width="80" :rules="rules">
				<FormItem label="用户名" prop="username">
					<Input v-model="dataForm.username" placeholder="请输入姓名" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="密码" prop="password">
					<Input v-model="dataForm.password" placeholder="请输入密码" clearable type="password" style="width: 150px"></Input>
				</FormItem>
				<FormItem label="邮箱" prop="email">
					<Input v-model="dataForm.email" placeholder="请输入邮箱" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="手机号" prop="phone">
					<Input v-model="dataForm.phone" placeholder="请输入电话号码" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="身份证号" prop="id_number">
					<Input v-model="dataForm.id_number" placeholder="请输入身份证号" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="管理权限" prop="roles">
					<RadioGroup v-model="dataForm.roles[0]" type="button" @on-change="ttt">
						<!-- <Radio label="超管"></Radio>
						<Radio label="文件管理"></Radio>
						<Radio label="查看用户"></Radio> -->
						<Radio label="super">超管</Radio>
						<Radio label="filemanager">文件管理</Radio>
						<Radio label="filebrowser">查看用户</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="用户说明" prop="introduction">
					<Input v-model="dataForm.introduction" placeholder="用户说明" clearable type="textarea" :autosize="{minRows: 4,maxRows: 10}"></Input>
				</FormItem>
			</Form>
		</Modal>

	</div>
</template>
<script>
	import {
		getUserList,
		createUser,
		getUserInfo,
		updateUser,
		resetUserPwd,
		deleteUser
	} from "@/api/user";
	import { id_numberRule } from "utils/validate";
	export default {
		data() {
			return {
				total: 0, //总数据
				identity: "",
				modal1: false,

				modal2: false, //表单显示与隐藏
				loading: true, //保存按钮的显示与隐藏
				dataForm: {
					//表单的数据
					username: "111111",
					password: "123456",
					email: "",
					phone: "",
					id_number: "20000",
					roles: ["super"],
					introduction: "备注说明备注说明备注说明备注说明备注说明"
				},

				//表单验证
				rules: {
					username: {
						required: true,
						message: "用户名不能为空",
						trigger: "blur"
					},
					password: [{
							required: true,
							message: "密码不能为空",
							trigger: "blur"
						},
						{
							type: "string",
							min: 6,
							message: "密码不能小于6位",
							trigger: "blur"
						}
					],
					email: {
						type: "email",
						message: "请输入正确的电子邮箱格式",
						trigger: "blur"
					},
					phone: {
						type: "string",
						pattern: /^1[34578]\d{9}$/,
						message: "请输入正确的手机号码格式",
						trigger: "blur"
					},
					id_number: [{
							required: true,
							message: "身份证号码不能为空",
							trigger: "blur"
						},
						{
							type: "string",
							//pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
							//message: "请输入合法的身份证号码",
							validator: id_numberRule,
							trigger: "blur"
						}
					],
					roles: {
						required: true,
						type: "array",
						message: "权限不能为空",
						trigger: "blur"
					},
					introduction: {
						type: "string",
						max: 500,
						message: "用户说明不能大于500个字",
						trigger: "blur"
					}
				},

				clientWidth: true,
				columns1: [{
						title: "用户名",
						key: "username",
						align: "center",
						width: 100
					},
					{
						title: "身份证号",
						key: "id_number",
						align: "center",
						minWidth: 180
					},
					{
						title: "备注说明",
						key: "introduction",
						align: "center"
					},
					{
						title: "管理操作",
						key: "action",
						width: 460,
						align: "center",
						render: (h, params) => {
							return h(
								"div", {
									style: {
										display: "flex",
										justifyContent: "space-between"
									}
								}, [
									h(
										"Button", {
											props: {
												size: "small"
											},

											on: {
												click: () => {
													this.show(params);
												}
											}
										},
										"文件权限"
									),
									h(
										"Button", {
											props: {
												type: "success",
												size: "small"
											},
											on: {
												click: () => {
													this.setup(params.row.userid);
												}
											}
										},
										"设置权限"
									),
									h(
										"Button", {
											props: {
												type: "warning",
												size: "small"
											},
											on: {
												click: () => {}
											}
										},
										"重置用户密码"
									),
									h(
										"Button", {
											props: {
												type: "success",
												size: "small"
											},
											on: {
												click: () => {
													this.change(params.row.userid);
												}
											}
										},
										"查看/更新用户"
									),
									h(
										"Button", {
											props: {
												type: "error",
												size: "small"
											},
											on: {
												click: () => {
													//console.log(params.row.id_number);
													let id_number = params.row.id_number;
													this.deleteUser(id_number);
												}
											}
										},
										"删除用户"
									)
								]
							);
						}
					}
				],
				data1: [{
						username: "用户1",
						id_number: "4444444444444",
						userid: "111",
						introduction: "备注说明备注说明备注说明备注说明备注说明备注说明备注说明",
						region: [{
								regionname: "region1",
								client: ["client1-1", "client1-2", "client1-3"]
							},
							{
								regionname: "region2",
								client: ["client2-1", "client2-2", "client2-3"]
							}
						]
					},
					{
						username: "用户2",
						id_number: "5555555555555",
						userid: "222",
						introduction: "备注说明备注说明备注说明备注说明备注说明备注说明备注说明",
						region: [{
							regionname: "region1",
							client: ["client1-1", "client1-2", "client1-3"]
						}]
					}
				],
				data2: [{
						title: "站点1",
						children: [{
								title: "客户端 1-1"
							},
							{
								title: "客户端 1-2"
							}
						]
					},
					{
						title: "站点2",
						children: [{
								title: "客户端 2-1"
							},
							{
								title: "客户端 2-2"
							}
						]
					}
				],
				//查询
				search: "", //用于把字符串转化为对象内容作为请求数据参数
				listQuery: {
					// searchkeys: {
					//   id_number: [""]
					// },
					page: 1, //当前页
					limit: 20 //一页多少条记录
				}
			};
		},
		created() {
			let self = this;
			//获取用户列表
			this.getUserList();

			//根据浏览器可见宽度显示隐藏备注说明列
			this.showColumn();
			window.onresize = this.showColumn;
		},
		mounted() {
			let kg = document.querySelectorAll(".kg");
			kg.forEach(function(dom) {
				dom.onclick = function(e) {
					e.stopPropagation();
				};
			});
		},
		methods: {
			//获取用户列表
			getUserList() {
				getUserList(this.listQuery).then(res => {
					//console.log(res);
					if(res.error_code === 0) {
						this.data1 = res.data.results;
						this.total = res.data.total;
					}
				});
			},
			//提交表单，添加/更新
			saveForm() {

				this.$refs.dataForm.validate(valid => {
					if(valid) {
						createUser(this.dataForm).then(res => {
							if(res.error_code === 0) {
								this.getUserList();
								this.modal2 = false;
							}
						});
					} else {
						this.loading = false;
						setTimeout(() => {
							this.loading = true;
						}, 0);
						this.$Message.error('输入信息有误！');
					}
				});
			},
			//删除用户
			deleteUser(id_number) {
				this.$Modal.confirm({
					title: "删除",
					content: "是否删除该数据？",
					onOk: () => {
						deleteUser({
							id_number
						}).then(res => {
							if(res.error_code === 0) {
								this.getUserList();
							}
						});
					}
				});
			},

			//切换页面
			pageChange(page) {
				this.listQuery.page = page;
				this.getLogsList();
			},
			ttt(xxx) {
				console.log(this.dataForm.roles);
			},
			showColumn() {
				if(document.body.clientWidth < 1200 && this.clientWidth == true) {
					this.columns1.splice(2, 1);
					this.clientWidth = false;
				} else if(
					document.body.clientWidth > 1200 &&
					this.clientWidth == false
				) {
					this.columns1.splice(2, 0, {
						title: "备注说明",
						key: "introduction",
						align: "center"
					});
					this.clientWidth = true;
				}
			},
			show(params) {
				let dom = "";
				params.row.region.forEach(function(value) {
					let regionname =
						"<div><span>站点：</span>" +
						value.regionname +
						'</div><div class="eject"><span>客户端：</span>';
					value.client.forEach(function(val) {
						let client = val + "、";
						regionname += client;
					});

					dom += regionname;
					dom += "</div>";
				});
				this.$Modal.info({
					title: "已有权限",
					content: dom
				});
			},
			setup(userid) {
				this.modal1 = true;
			},
			accounts() {
				this.modal2 = true;
			},
			change(userid) {
				this.modal2 = true;
			}
		}
	};
</script>
<style type="text/css">
	.filelist .ivu-table th {
		background-color: #2db7f5;
		color: #fff;
		font-size: 12px;
	}
	
	.eject {
		padding-bottom: 10px;
	}
	
	.ivu-modal-body {
		max-height: 75vh;
		overflow-y: auto;
	}
	
	.ivu-collapse>.ivu-collapse-item>.ivu-collapse-header>i {
		display: none;
	}
	
	.ivu-collapse>.ivu-collapse-item p {
		height: 38px;
		line-height: 38px;
	}
	
	.switch {
		display: inline-block;
		float: right;
		margin: 12px 20px 0 0;
	}
	
	.ivu-collapse-content {
		padding-right: 0;
	}
	
	.xgqx .ivu-modal-footer {
		display: none;
	}
	
	.kg {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}
</style>