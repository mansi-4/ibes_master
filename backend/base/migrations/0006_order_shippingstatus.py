# Generated by Django 4.1 on 2023-02-26 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_orderitem_color_orderitem_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='shippingStatus',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]