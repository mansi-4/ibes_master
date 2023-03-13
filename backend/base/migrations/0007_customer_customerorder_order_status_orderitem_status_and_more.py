# Generated by Django 4.1 on 2023-03-12 12:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_order_shippingstatus'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_name', models.CharField(blank=True, max_length=255, null=True)),
                ('customer_phone_no', models.CharField(blank=True, max_length=255, null=True)),
                ('customer_address', models.CharField(blank=True, max_length=255, null=True)),
                ('customer_city', models.CharField(blank=True, max_length=255, null=True)),
                ('customer_pincode', models.CharField(blank=True, max_length=255, null=True)),
                ('customer_country', models.CharField(blank=True, max_length=255, null=True)),
                ('status', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'tblcustomer',
            },
        ),
        migrations.CreateModel(
            name='CustomerOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paymentMethod', models.CharField(blank=True, max_length=200, null=True)),
                ('discountPercentage', models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True)),
                ('totalPrice', models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True)),
                ('isPaid', models.BooleanField(default=False)),
                ('paidAt', models.DateTimeField(blank=True, null=True)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('status', models.IntegerField(default=0)),
                ('customer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.customer')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.users')),
            ],
            options={
                'db_table': 'tblcustomer_order',
            },
        ),
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='status',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='review',
            name='status',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='shippingaddress',
            name='status',
            field=models.IntegerField(default=0),
        ),
        migrations.CreateModel(
            name='CustomerOrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('color', models.CharField(blank=True, max_length=200, null=True)),
                ('size', models.CharField(blank=True, max_length=200, null=True)),
                ('qty', models.IntegerField(blank=True, default=0, null=True)),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True)),
                ('image', models.CharField(blank=True, max_length=200, null=True)),
                ('status', models.IntegerField(default=0)),
                ('order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.customerorder')),
                ('product_variation', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.productvariations')),
            ],
            options={
                'db_table': 'tblcustomer_order_item',
            },
        ),
    ]
