<footer class="footer" role="contentinfo">
	<div class="grid-container"><div class="grid-x grid-margin-x align-middle">
		<div class="cell small-12 medium-6">
			<p>Foundational Theme - Powered by <a href="https://get.foundation" target="_blank">Foundation for Sites</a> and <a href="https://silverstripe.org" target="_blank">SilverStripe</a></p>
		</div>
		<div class="cell small-12 medium-6">
			<ul id="menu-main-menu" class="menu">
				<% loop $Menu(1) %>
					<li class="$LinkingMode"><a href="$Link" title="$Title.XML">$MenuTitle.XML</a></li>
				<% end_loop %>
			</ul>
		</div>
	</div></div>
</footer>
