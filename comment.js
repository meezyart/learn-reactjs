var converter = new Showdown.converter();

// CommentBox (Main Component)
var CommentBox = React.createClass({

  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({ data: newComments })
    //$.ajax({
    //       url: this.props.url,
    //       dataType: 'json',
    //       type: 'POST',
    //       data: comment,
    //       success: function(data) {
    //         this.setState({data: data});
    //       }.bind(this),
    //       error: function(xhr, status, err) {
    //         console.error(this.props.url, status, err.toString());
    //       }.bind(this)
    //     });
  },
  getInitialState: function () {
     return {
       data:[]
     };
   },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  render: function () {
    return (
        <div className="commentBox">
          <h1>Comments</h1>
          <CommentList data={this.state.data}/>
          <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
    );
  }
});

// Comment List
var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
          <Comment key={comment.id} author={comment.author}>
            {comment.text}
          </Comment>
      );
    });
    return (
        <div className="commentList">
            {commentNodes}
        </div>
    );
  }
});

// Comment Block
var Comment = React.createClass({

  render: function () {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
        <div className="comment">
          <h1>{this.props.author}</h1>
            <p>{this.props.key}</p>
          <div dangerouslySetInnerHTML={{__html: rawMarkup}} ></div>
        </div>
    );
  }
});

// Comment Form
var CommentForm = React.createClass({
  handleOnSubmit: function (e) {
    e.preventDefault();
    var author = this.refs.commentAuthor.getDOMNode().value.trim();
    var text = this.refs.commentText.getDOMNode().value.trim();
    if (!author || !text) {
      return;
    }
    console.log(author +":"+ text);
    this.props.onCommentSubmit({author:author, text:text});
    //resets the form
    this.refs.commentAuthor.getDOMNode().value = '';
    this.refs.commentText.getDOMNode().value = '';
  },

  render: function () {
    return (
        <form className="commentForm" onSubmit={this.handleOnSubmit}>
          <input type="text" placeholder="Your name" ref="commentAuthor" />
          <input type="text" placeholder="Say Something" ref="commentText" />
          <input type="submit" value="Post" />
        </form>
    );
  }
});

//Render Component
React.render(
    <CommentBox url="comments.json" pollInterval={2000}/>,
    document.getElementById('content'));