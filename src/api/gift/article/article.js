import request from '@/utils/request'

/* 获取文章列表*/
export function getArticleList(pageNum, pageSize, name, type) {
  return request({
    url: 'manage/article/list',
    method: 'post',
    data: {
      pageNum: pageNum,
      pageSize: pageSize,
      name: name,
      type: type
    }
  })
}

/* 删除文章*/
export function delArticleApi(id) {
  return request({
    url: 'manage/article/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 获得文章详情*/
export function getArticleDetail(id) {
  return request({
    url: 'manage/article/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加文章*/
export function addArticleApi(article) {
  return request({
    url: 'manage/article/add',
    method: 'post',
    data: article
  })
}

/* 修改文章*/
export function updateArticleApi(article) {
  return request({
    url: 'manage/article/update',
    method: 'post',
    data: article
  })
}

/* 修改文章状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/article/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 获取文章商品列表*/
export function getArticleItemList(id) {
  return request({
    url: 'manage/article/item_list',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加文章商品*/
export function addArticleItem(articleId, ids) {
  return request({
    url: 'manage/article/add_item',
    method: 'post',
    data: {
      articleId: articleId,
      ids: ids
    }
  })
}

/* 删除文章商品*/
export function delArticleItem(id) {
  return request({
    url: 'manage/article/del_item',
    method: 'post',
    data: {
      id: id
    }
  })
}
/* 文章场景类别*/
export function getSceneListAll() {
  return request({
    url: 'manage/article/scene_list_all',
    method: 'post',
    data: {}
  })
}
/* 文章场景类别*/
export function getFestivalListAll() {
  return request({
    url: 'manage/article/festival_list',
    method: 'post',
    data: {}
  })
}
/* 文章场景类别*/
export function getArLabelListAll() {
  return request({
    url: 'manage/article/label_list',
    method: 'post',
    data: {}
  })
}
