var PhotoBox = React.createClass({
	getInitialState: function() {
                return {data: []};
            },
    loadPhotosFromServer: function() {
                $.ajax({
                    url: this.props.url,
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        this.setState({data: data});
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
            },
     componentDidMount: function() {
                this.loadPhotosFromServer();
            },
	render: function() {
		return(
			<div className="photoBox">
                <h1>Photos</h1>
                <PhotoList data={this.state.data} />
            </div>
		);
	}
});

var PhotoList = React.createClass({
	render: function() {
		var photos = this.props.data.map(function(photo){
			return (
				<Photo key={photo.id} source={photo.picture} caption={photo.text} />
			);
		});
		return (
			<ul className="photoList">
				{photos}
			</ul>
		);
	}
});

var Photo = React.createClass({
	render: function() {
		return (
			<div className="photoBox">
				<img src={this.props.source} alt="App Sheet Photo" />
				<p className="photoCaption">{this.props.caption}</p>
			</div>
		);
	}
})

React.render(
    <PhotoBox url="https://appsheettest1.azurewebsites.net/sample/posts" />,
    document.getElementById('content')
);