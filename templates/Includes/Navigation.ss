

	<div class="cell small-2 hide-for-medium zindex-1">
		<div class="hamburger-wrap" data-responsive-toggle="mobile-menu" data-hide-for="medium">
			<div class="hamburger">
				<button aria-label="Main Menu" class="menu-icon" type="button" data-toggle="mobile-menu"></button>
			</div>
		</div>
	</div>

	<div class="cell medium-12 hide-for-small-only">
		<ul id="menu-main-menu" class="dropdown menu desktop-menu float-right">
			<% loop $Menu(1) %>
				<li class="$LinkingMode"><a href="$Link" title="$Title.XML">$MenuTitle.XML</a></li>
			<% end_loop %>
		</ul>
	</div>

