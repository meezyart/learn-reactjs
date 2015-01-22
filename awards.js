
///the individual app item
var AwardsItem = React.createClass({
  render: function () {

    return (
        <div>
          <h3>
            <strong>{this.props.awardName}</strong> - {this.props.prize} -<em>{this.props.category}</em>
            <br/>
          </h3>
        </div>
    )
  }
});

//create list of awardName clumped per year accepts
// awardYear: string awards: []
var AwardsList = React.createClass({

  render: function () {
    var awardItemData = this.props.awards.map(function (awardItem) {
      return <AwardsItem awardName={awardItem.awardName} category={awardItem.category} prize={awardItem.prize} />
    });

    return (

        <div class="row">
          <div class="col-md-12">
            <h1>{this.props.awardYear}</h1>
              {awardItemData}
          </div>
          <hr/>
        </div>


    )
  }
});

/*---------------------------------------------------------------------------------*/
/*   -  
 /*---------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------*/
/*  klsdjfsdklfjl - skldjfslkdjfsl
/*---------------------------------------------------------------------------------*/

var AwardForm = React.createClass({
  getInitialState: function () {
        return {
          awardName:null,
          prize:null,
          category:null,
          awardYear:null

        };
      },

  addAward: function (e) {

    e.preventDefault();
    var award = this.refs.AwardName.getDOMNode().value.trim();
    var prize = this.refs.Prize.getDOMNode().value.trim();
    var Category = this.refs.Category.getDOMNode().value.trim();
    var awardYear = this.refs.awardYear.getDOMNode().selected.value.trim();
    console.log(awardYear);
    if(!prize || !Category || !award || !awardYear){
      alert('enter in infomation');
      return;
    }
    // send up info to the parent
    this.props.onAwardSubmit({
      awardName:award,
      prize:prize,
      category:Category,
      awardYear:awardYear
    });


    this.setState({
      awardName: '',
      prize:'',
      category:''
    })

  },
  
  render: function () {

    return (
        <div>
          <h1>Add Award</h1>
          <br/>
          <form onSubmit={this.addAward}>

            <label>Award name:</label>
            <input type="text" value={this.state.awardName}  ref="AwardName" />
            <label>prize:</label>
            <input type="text" value={this.state.prize} ref="Prize" />
            <label>Award Catergory:</label>
            <input type="text" value={this.state.category}  ref="Category"/>
            <select ref="awardYear">
              <option value="2014">2014</option>
              <option value="2013">2013</option>
            </select>
            <button>add Award</button>
          </form>
        </div>

    )
  }
});

// Container App
var AwardsApp = React.createClass({
  loadAwards: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  handleAwards:function(awardData){



  },
  getInitialState: function () {
       return {
         data:[]
       };
     },
  componentDidMount: function () {
    this.loadAwards();

  },
  render: function () {
    var awardListData = this.state.data.map(function (awardlist) {
      return <AwardsList awardYear={awardlist.awardYear} awards={awardlist.awardItems} />
    });

    return (
        <div>
          <AwardForm onAwardSubmit={this.handleAwards}/>
         <hr/>
          <h1 class="text-center">Awards</h1>
            {awardListData}
        </div>
    )
  }
});


React.render(<AwardsApp url="data\eveoAwards.json" />, document.getElementById("app"));