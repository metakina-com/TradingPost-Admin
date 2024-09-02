<template>
  <div class="user">
    <el-button class="filter-item" type="primary" @click="handleCreate">
      添加轮播图</el-button
    >
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column
        prop="bannerUrl"
        label="图片"
        min-width="650"
        align="center"
      >
        <template slot-scope="scope">
          <img :src="scope.row.bannerUrl" min-width="150" height="100" />
        </template>
      </el-table-column>
      <el-table-column
        prop="bannerUrl"
        label="PC/APP"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.bannerType == 'PC_BANNER'">PC</p>
          <p v-else>APP</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        min-width="105"
        align="center"
      >
        <template slot-scope="row">
          <!-- 		<el-button type="success" size="mini" @click="xiugai(row)">
						修改轮播图
					</el-button> -->
          <el-button type="danger" size="mini" @click="del(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogamend" :fullscreen="true" width="100%">
      <el-form :label-position="'left'" label-width="80px" :model="modifyData">
        <el-form-item label="上传方式">
          <el-select
            v-model="modifyData.bannerType"
            @change="controlTypeChange"
            placeholder="选择上传方式"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
  
	  <h4 style="color:red;">请先选择上传方式，选择图片并上传裁剪框对应尺寸</h4>
      <div class="cropper-content">
        <div class="cropper-box">
          <div class="cropper">
            <vue-cropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.outputSize"
              :outputType="option.outputType"
              :info="option.info"
              :canScale="option.canScale"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              :full="option.full"
              :fixedBox="option.fixedBox"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :centerBox="option.centerBox"
              :height="option.height"
              :infoTrue="option.infoTrue"
              :maxImgSize="option.maxImgSize"
              :enlarge="option.enlarge"
              :mode="option.mode"
              @realTime="realTime"
              @imgLoad="imgLoad"
            >
            </vue-cropper>
          </div>
          <!--底部操作工具按钮-->
          <div class="footer-btn">
            <div class="scope-btn">
              <label class="btn" for="uploads">选择图片</label>
              <input
                type="file"
                id="uploads"
                style="position: absolute; clip: rect(0 0 0 0)"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                @change="selectImg($event)"
              />
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-zoom-in"
                @click="changeScale(1)"
                >放大
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-zoom-out"
                @click="changeScale(-1)"
              >
                缩小
              </el-button>
              <el-button size="mini" type="danger" plain @click="rotateLeft"
                >↺ 左旋转</el-button
              >
              <el-button size="mini" type="danger" plain @click="rotateRight"
                >↻ 右旋转</el-button
              >
            </div>
            <div class="upload-btn">
              <el-button size="mini" type="success" @click="uploadImg('blob')"
                >上传轮播图 <i class="el-icon-upload"></i>
              </el-button>
            </div>
          </div>
        </div>

        <div class="show-preview">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogamend = false">
          关闭
        </el-button>
        <el-button type="primary" @click="amendList()"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :visible.sync="xiugailunbo" :fullscreen="true">
      <el-form :label-position="'left'" label-width="80px" :model="modifyData">
        <el-form-item label="上传方式">
          <el-select
            v-model="modifyData.bannerType"
            @change="controlTypeChange"
            placeholder="选择上传方式"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
	  <h4 style="color:red;">请先选择上传方式，选择图片并上传裁剪框对应尺寸</h4>
      <div class="cropper-content">
        <div class="cropper-box">
          <div class="cropper">
            <vue-cropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.outputSize"
              :outputType="option.outputType"
              :info="option.info"
              :canScale="option.canScale"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              :full="option.full"
              :fixedBox="option.fixedBox"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :centerBox="option.centerBox"
              :height="option.height"
              :infoTrue="option.infoTrue"
              :maxImgSize="option.maxImgSize"
              :enlarge="option.enlarge"
              :mode="option.mode"
              @realTime="realTime"
              @imgLoad="imgLoad"
            >
            </vue-cropper>
          </div>
          <!--底部操作工具按钮-->
          <div class="footer-btn">
            <div class="scope-btn">
              <label class="btn" for="uploads">选择图片</label>
              <input
                type="file"
                id="uploads"
                style="position: absolute; clip: rect(0 0 0 0)"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                @change="selectImg($event)"
              />
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-zoom-in"
                @click="changeScale(1)"
                >放大
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-zoom-out"
                @click="changeScale(-1)"
              >
                缩小
              </el-button>
              <el-button size="mini" type="danger" plain @click="rotateLeft"
                >↺ 左旋转</el-button
              >
              <el-button size="mini" type="danger" plain @click="rotateRight"
                >↻ 右旋转</el-button
              >
            </div>
            <div class="upload-btn">
              <el-button size="mini" type="success" @click="uploadImg('blob')"
                >上传轮播图 <i class="el-icon-upload"></i>
              </el-button>
            </div>
          </div>
        </div>

        <div class="show-preview">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="xiugailunbo = false">
          关闭
        </el-button>
        <el-button type="primary" @click="alter()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QuillEditor from "@/components/quillEditor/quillEditor";

import { VueCropper } from "vue-cropper";
import { getDatetime } from "@/api/user";
import Pagination from "@/components/Pagination";
export default {
  name: "",
  components: {
    VueCropper,
    QuillEditor,
  },
  data() {
    return {
      options: [
        {
          label: "PC",
          value: "PC_BANNER",
        },
        {
          label: "APP",
          value: "DATA_BANNER",
        },
      ],
      listQuery: {},
      xiugailunbo: false,
      dialogamend: false,
      name: this.Name,
      previews: {},
      option: {
        img: "", //裁剪图片的地址
        outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
        outputType: "jpeg", //裁剪生成图片的格式（jpeg || png || webp）
        info: true, //图片大小信息
        canScale: true, //图片是否允许滚轮缩放
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: 750, //默认生成截图框宽度
        autoCropHeight: 300, //默认生成截图框高度
        fixed: true, //是否开启截图框宽高固定比例
        fixedNumber: [1, 1], //截图框的宽高比例
        full: false, //false按原比例裁切图片，不失真
        fixedBox: true, //固定截图框大小，不允许改变
        canMove: false, //上传图片是否可以移动
        canMoveBox: true, //截图框能否拖动
        original: false, //上传图片按照原始比例渲染
        centerBox: false, //截图框是否被限制在图片里面
        height: true, //是否按照设备的dpr 输出等比例图片
        infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000, //限制图片最大宽度和高度
        enlarge: 1, //图片根据截图框输出比例倍数
        mode: "300px 750px", //图片默认渲染方式
      },
      // 750,400/宽高
      list: null,
      modifyData: {
        bannerUrl: "",
        id: "",
        linkUrl: "",
        global: "CHINESE_SIM",
      },
      id: "",
    };
  },
  created() {
    this.getlist();
  },
  mounted() {},
  methods: {
    controlTypeChange(e) {
      console.log(e);
      if (e == "PC_BANNER") {
        this.option.autoCropWidth = 960;
        this.option.autoCropHeight = 270;
        this.option.fixedNumber = [32, 9];
      } else {
        this.option.autoCropWidth = 690;
        this.option.autoCropHeight = 280;
        this.option.fixedNumber = [2.46, 1];
      }
    },

    xiugai(row) {
      //修改轮播图
      (this.modifyData.bannerUrl = ""), console.log(row.row);
      this.modifyData.id = row.row.id;
      this.xiugailunbo = true;
    },
    beforeAvatarUpload(file) {
      let _this = this;
      const is1M = file.size / 1024 / 1024 < 2; // 限制小于1M
      const isSize = new Promise(function (resolve, reject) {
        let width = 750; // 限制图片尺寸为654X750
        let height = 656;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          let valid = img.width === width && img.height === height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸限制为750 x 656 , 大小不可超过2MB");
          return Promise.reject();
        }
      );
      if (!is1M) {
        _this.$message.error("图片尺寸限制为750 x 656, ");
      }
      console.log(isSize);
      return isSize;
    },
    alter() {
      //修改轮播图
	
      if (this.modifyData.bannerUrl == "") {
        this.$message.error("请上传轮播图");
        return;
      }
      this.$http
        .post1("/sysAdmin/upBanner", this.modifyData)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.$message({
              message: "操作成功",
              type: "success",
            });
			this.getlist()
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.getlist();
          this.xiugailunbo = false;
          this.option.img = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // /sysAdmin/getBanner
    getlist() {
      this.$http
        .get("/admin/sysAdmin/getBanners")
        .then((res) => {
          this.list = res.result.records;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCreate() {
      this.dialogamend = true;
    },
    amendList() {
      //添加轮播图
	 
      if (this.modifyData.bannerUrl == "") {
        this.$message.error("请上传轮播图");
        return;
      }
      console.log(this.modifyData);
      // return
      this.$http
        .post1("/admin/sysAdmin/addBanner", this.modifyData)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.$message({
              message: "操作成功",
              type: "success",
            });
			this.getlist()
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.dialogamend = false;
          this.getlist();
          this.option.img = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //图片
    realTime(data) {
      this.previews = data;
    },
    //初始化函数
    imgLoad(msg) {
      // console.log("工具初始化函数=====" + msg)
    },
    //图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    //向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    //向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    //实时预览函数
    realTime(data) {
      this.previews = data;
    },
    //选择图片
    selectImg(e) {
      let file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: "图片类型要求：jpeg、jpg、png",
          type: "error",
        });
        return false;
      }
      //转化为blob
      let reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === "object") {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      };
      //转化为base64
      reader.readAsDataURL(file);
    },
    //上传图片
    uploadImg(type) {
      console.log(type);
      let _this = this;
      if (type === "blob") {
        //获取截图的blob数据
        this.$refs.cropper.getCropBlob(async (data) => {
          console.log(data);
          let formData = new FormData();
          formData.append("file", data, "DX.jpg");
          console.log(formData);
          //调用方法上传
          this.$http
            .post1("/admin/sysAdmin/uploadImge", formData)
            .then((res) => {
              if (res.status == 'SUCCEED') {
                this.modifyData.bannerUrl = res.result;
                this.modifyData.linkUrl = res.result;

                this.$message({
                  message: "图片上传成功",
                  type: "success",
                });
                console.log(this.modifyData.bannerUrl);
              }else{
                this.$message({
                  message: res.errorMessage,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },

    // 添加
    addmarketClick() {},
    // 删除
    del(row) {
      let id = row.row.id;
      this.$confirm(`确认删除该轮播图 ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .post("/admin/sysAdmin/delBanner", {
            id: id,
          })
          .then((res) => {
            this.$message({
              message: "图片删除成功",
              type: "success",
            });
            this.getlist();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
  width: 95%;
  margin: 50px auto;
}

.el-row {
  margin-bottom: 20px;
  border-radius: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.content {
  padding: 20px;
}

.el-col {
  border-radius: 24px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 10px;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
  border-left: 5px solid green;
}

.row-bg {
  padding: 0px 0;
  background-color: #f9fafc;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  // border-top: 1px solid #f5f5f5;
}

// .avatar-uploader {
//   padding-left: 50px;
// }

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

//图片
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;

  .cropper-box {
    flex: 1;
    width: 100%;

    .cropper {
      width: auto;
      height: 500px;
    }
  }

  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;

    .preview {
      overflow: hidden;
      border: 1px solid #67c23a;
      background: #cccccc;
    }
  }
}

.footer-btn {
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;

  .scope-btn {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding-right: 10px;
  }

  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }

  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    margin-right: 10px;
  }
}

.btntupian {
  outline: none;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 8px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  margin-right: 10px;
}

.content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;

  .box {
    flex: 1;
    width: 100%;

    .croppers {
      width: auto;
      height: 300px;
    }
  }

  .preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;

    .previews {
      overflow: hidden;
      border: 1px solid #67c23a;
      background: #cccccc;
    }
  }
}

.footer {
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;

  .scope {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding-right: 10px;
  }

  .upload {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }

  .btns {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    margin-right: 10px;
  }
}
</style>
