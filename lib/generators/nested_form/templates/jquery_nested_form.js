jQuery(function($) {
    $('table tfoot a.add_nested_fields').live('click', function() {
        // Setup
        var assoc = $(this).attr('data-association');              // Name of child
        var table_name = $(this).attr('table-name');
        var content = $('#' + assoc + '_fields_blueprint').text(); // Fields template

        // Make the context correct by replacing new_<parents> with the generated ID
        // of each of the parent objects
        //var context = ($(this).closest('.fields').find('input:first').attr('name') || '').replace(new RegExp('\[[a-z]+\]$'), '');

        var context = ($('#' + table_name).find(".fields").find('input:first').attr('name') || '').replace(new RegExp('\[[a-z]+\]$'), '');

        // context will be something like this for a brand new form:
        // project[tasks_attributes][1255929127459][assignments_attributes][1255929128105]
        // or for an edit form:
        // project[tasks_attributes][0][assignments_attributes][1]
        if (context) {
            var parent_names = context.match(/[a-z_]+_attributes/g) || [];
            var parent_ids = context.match(/(new_)?[0-9]+/g) || [];

            for (i = 0; i < parent_names.length; i++) {
                if (parent_ids[i]) {
                    content = content.replace(
                            new RegExp('(\\[' + parent_names[i] + '\\])\\[[0-9]+?\\]', 'g'),
                            '$1[' + parent_ids[i] + ']');

                    content = content.replace(
                            new RegExp('(_' + parent_names[i] + ')_[0-9]+?_', 'g'),
                            '$1_' + parent_ids[i] + '_');

                }
            }
        }

        // Make a unique ID for the new child
        var regexp = new RegExp('new_' + assoc, 'g');
        var new_id = new Date().getTime();
        content = content.replace(regexp, new_id);

        $('#' + table_name + " > tbody > tr:last").after(content);
        $(this).closest("form").trigger('nested:fieldAdded');

        return false;
    });

    $('form a.remove_nested_fields').live('click', function() {
        var hidden_field = $(this).prev('input[type=hidden]')[0];
        if (hidden_field) {
            hidden_field.value = '1';
        }
        $(this).closest('.fields').hide();
        return false;
    });
});

function sumOfColumns(tableID, columnIndex, hasHeader) {
    var tot = 0.00;
    var val = 0.00;
    $("#" + tableID + " tr" + (hasHeader ? ":gt(0)" : ""))
            .children("td:nth-child(" + columnIndex + ")").children()
            .each(function() {

        alert($(this).value());
        tot += val;

    });
    return tot;
}

$(document).ready(function() {

    $("#products-recipe-1 input[type='text']").change(function() {
        $("#products-recipe-1-total-precio").html(sumOfColumns("products-recipe-1", 3, true));
    });
});