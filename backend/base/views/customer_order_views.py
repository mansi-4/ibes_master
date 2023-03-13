from django.shortcuts import render,HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser

from rest_framework.response import Response

from base.models import Product, CustomerOrder, CustomerOrderItem,Users,ProductVariations,Color,Size,Customer

from rest_framework.exceptions import AuthenticationFailed
import jwt
from rest_framework import status
from datetime import datetime
import pdfkit

@api_view(["GET"])
def getCustomerOrders(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            orders=CustomerOrder.objects.prefetch_related("customerorderitem_set").select_related("user").select_related("customer")
            serialized_orders=[]
            if(len(orders)>0):
                for o in orders:
                    serialized_order_item=[]
                    order_items=o.customerorderitem_set.all()
                    for i in order_items:
                        product_variation=ProductVariations.objects.get(id=i.product_variation_id)
                        oi={"_id":i.id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),"product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
                        serialized_order_item.append(oi)
                    serialized_customer={"id": o.customer.id,"phone_no": o.customer.customer_phone_no,"name": o.customer.customer_name,"address": o.customer.customer_address,"city": o.customer.customer_city,"postalCode": o.customer.customer_pincode,"country": o.customer.customer_country}
                    st={"_id":o.id,"paymentMethod": o.paymentMethod,"discountPercentage": o.discountPercentage,"totalPrice": o.totalPrice,"isPaid": o.isPaid,"paidAt": o.paidAt,"createdAt": o.createdAt,"orderItems":serialized_order_item,"customer":serialized_customer}
                    serialized_orders.append(st)
                return Response(serialized_orders)
            else:
                return Response(serialized_orders)
        else:
            return Response("you're not an admin")
    else: 
        return Response("Authorization Token not provided")

@api_view(["POST"])
def addOrderItems(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        try:
            data = request.data
            orderItems = data['orderItems']
        
            if orderItems and len(orderItems) == 0:
                return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
            else: 

                # (1) Create order
                customer= Customer.objects.create(
                    customer_name=data["customer_name"],
                    customer_phone_no=data["phone_no"],
                    customer_address=data["address"],
                    customer_city=data["city"],
                    customer_pincode=data["postal_code"],
                    customer_country=data["country"]
                )
                customer_order = CustomerOrder.objects.create(
                    user=user,
                    customer=customer,
                    paymentMethod="Cash",
                    discountPercentage=data['discountPercentage'],
                    totalPrice=data['totalPrice'],
                    isPaid=True,
                    paidAt=datetime.now()
                )

                

                # # (2) Create order items and set order to orderItem relationship
                for i in orderItems:
                    # product = Product.objects.get(_id=i['product'])
                    product_variation=ProductVariations.objects.select_related("product").select_related("color").select_related("size").get(id=i["product_variation_id"])

                    product_images=product_variation.product.image
                    serialized_images=[]
                    if product_images!=None:
                        split_images_list=product_images.split(",")
                        for s in split_images_list:
                            serialized_images.append(str(s))
                    item = CustomerOrderItem.objects.create(
                        product_variation=product_variation,
                        order=customer_order,
                        name=product_variation.product.name,
                        color=i["color"],
                        size=i["size"],
                        qty=i['qty'],
                        price=i['price'],
                        image=serialized_images[0],
                    )

                #     # (4) Update stock

                    product_variation.countInStock -= item.qty
                    product_variation.save()

                # serializer = OrderSerializer(order, many=False)
                order=CustomerOrder.objects.prefetch_related("customerorderitem_set").select_related("user").select_related("customer").get(id=customer_order.id)
                serialized_order_item=[]
                order_items=order.customerorderitem_set.all()
                for i in order_items:
                    product_variation=ProductVariations.objects.get(id=i.product_variation_id)
                    oi={"_id":i.id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),"product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
                    serialized_order_item.append(oi)
                serialized_customer={"id": order.customer.id,"phone_no": order.customer.customer_phone_no,"name": order.customer.customer_name,"address": order.customer.customer_address,"city": order.customer.customer_city,"postalCode": order.customer.customer_pincode,"country": order.customer.customer_country}
                st={"_id":order.id,"paymentMethod": order.paymentMethod,"discountPercentage": order.discountPercentage,"totalPrice": order.totalPrice,"isPaid": order.isPaid,"paidAt": order.paidAt,"createdAt": order.createdAt,"orderItems":serialized_order_item,"customer":serialized_customer}
                return Response(st)
        except:
            return Response("Unable to place order")
    else:
        return Response("Authorization Token not provided")

@api_view(["GET"])
def getCustomerOrderById(request,pk):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            order=CustomerOrder.objects.prefetch_related("customerorderitem_set").select_related("user").select_related("customer").get(id=pk)
            serialized_order_item=[]
            order_items=order.customerorderitem_set.all()
            for i in order_items:
                product_variation=ProductVariations.objects.get(id=i.product_variation_id)
                oi={"_id":i.id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),"product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
                serialized_order_item.append(oi)
            serialized_customer={"id": order.customer.id,"phone_no": order.customer.customer_phone_no,"name": order.customer.customer_name,"address": order.customer.customer_address,"city": order.customer.customer_city,"postalCode": order.customer.customer_pincode,"country": order.customer.customer_country}
            st={"_id":order.id,"paymentMethod": order.paymentMethod,"discountPercentage": order.discountPercentage,"totalPrice": order.totalPrice,"isPaid": order.isPaid,"paidAt": order.paidAt,"createdAt": order.createdAt,"orderItems":serialized_order_item,"customer":serialized_customer}
            return Response(st)
        else:
            return Response("you're not an admin")
    else: 
        return Response("Authorization Token not provided")