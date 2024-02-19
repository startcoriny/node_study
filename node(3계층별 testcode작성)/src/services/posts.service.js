export class PostsService {
  // 여기서 PostsRepository의 인스턴스를 생성하면 PostsRepository 클래스의 생성자가 자동 호출됨.
  // 생성자가 호출되면 prisma 객체를 받고 this.prisma에 저장

  // 근데 여기서는 생성자에 인수를 안넣는 이유
  // 테스트 코드 작성은 prisma가 필요하지 않기 떄문!
  constructor(postsRepository) {
    this.postsRepository = postsRepository;
  }

  // 게시물 조회 서비스 비즈니스로직
  findAllPosts = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const posts = await this.postsRepository.findAllPosts();

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return posts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  // 게시물 생성 서비스 비즈니스로직
  createPost = async (nickname, password, title, content) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createdPost = await this.postsRepository.createPost(
      nickname,
      password,
      title,
      content,
    );

    return {
      postId: createdPost.postId,
      nickname: createdPost.nickname,
      title: createdPost.title,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };

  // 게시물 상세 조회 서비스 비즈니스로직
  findPostById = async (postId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(postId);

    return {
      postId: post.postId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  // 게시물 수정 서비스 비즈니스로직
  updatePost = async (postId, password, title, content) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error("존재하지 않는 게시글입니다.");

    // 저장소(Repository)에게 데이터 수정을 요청합니다.
    await this.postsRepository.updatePost(postId, password, title, content);

    // 변경된 데이터를 조회합니다.
    const updatedPost = await this.postsRepository.findPostById(postId);

    return {
      postId: updatedPost.postId,
      nickname: updatedPost.nickname,
      title: updatedPost.title,
      content: updatedPost.content,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  };

  // 게시물 삭제 서비스 비즈니스로직
  deletePost = async (postId, password) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error("존재하지 않는 게시글입니다.");

    // 저장소(Repository)에게 데이터 삭제를 요청합니다.
    await this.postsRepository.deletePost(postId, password);

    return {
      postId: post.postId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };
}
