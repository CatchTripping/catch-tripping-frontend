export const formatPostData = post => ({
  id: post.id || post.boardId,
  username: post.username || post.userName,
  avatar: post.avatar || post.profileImage,
  images: post.images || post.imageUrls,
  caption: post.caption || post.content,
  likes: post.likes || post.likesCount,
  isLiked: post.isLiked || post.isLikedByLogInUser,
})
