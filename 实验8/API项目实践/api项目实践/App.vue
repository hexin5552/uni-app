<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	view, text {
		box-sizing: border-box;
	}

	input {
		border: none;
		outline: none;
	}

	scroll-view {
		-webkit-overflow-scrolling: touch;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		background: transparent;
	}
</style>
