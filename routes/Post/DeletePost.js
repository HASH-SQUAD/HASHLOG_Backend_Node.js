const { Post } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const DeletePost = async (req, res) => {
	try {
		await Post.findOne({ where: { id: req.params.id } }).then(async post => {
			if (!post) {
				return res
					.status(401)
					.send(authUtil.successFalse(401, '게시글을 찾을 수 없습니다.'));
			}

			if (
				req.user.isAdmin ||
				(req.user.isAdmin && post.userid === req.user.userid)
			) {
				await Post.destroy({ where: { id: req.params.id } });
				return res
					.status(200)
					.send(authUtil.successTrue(200, 'ADMIN : 게시글 삭제 완료!'));
			} else {
				if (post.userid === req.user.userid) {
					await Post.destroy({ where: { id: req.params.id } });
					return res.status(200).send(authUtil.successTrue(200, '게시글 삭제 완료!'));
				} else {
					return res
						.status(401)
						.send(authUtil.successFalse(401, '글 작성자만 삭제할 수 있습니다.'));
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ end: err }));
	}
};

module.exports = DeletePost;
